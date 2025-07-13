import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';
import { getEnvVarOptional } from '../../../utils/getEnvVar';

// TODO: Use OneSignal as an alternative provider if needed
// import OneSignal from 'onesignal-node';

// Expo push notification endpoint
const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

interface NotificationPayload {
  user_id?: string;
  topic?: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user_id, topic, title, body, data } = req.body as NotificationPayload;

  if ((!user_id && !topic) || !title || !body) {
    return res.status(400).json({ error: 'Missing required notification fields' });
  }

  try {
    // Fetch Expo push token for the user (assume stored in profiles table)
    let pushToken: string | null = null;
    if (user_id) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('expo_push_token')
        .eq('id', user_id)
        .single();
      if (error) throw error;
      pushToken = profile?.expo_push_token || null;
    }
    // TODO: Support topic-based notifications (e.g., via OneSignal or Expo topics)

    if (!pushToken) {
      return res.status(404).json({ error: 'No push token found for user' });
    }

    // Send push notification via Expo
    const expoPayload = {
      to: pushToken,
      title,
      body,
      data: data || {},
      sound: 'default',
      priority: 'high',
    };
    const expoRes = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${getEnvVarOptional('EXPO_PUSH_API_KEY')}` // Not required for Expo push
      },
      body: JSON.stringify(expoPayload),
    });
    const expoResult = await expoRes.json();
    if (!expoRes.ok) {
      throw new Error(expoResult?.errors?.[0]?.message || 'Failed to send push notification');
    }

    // Store notification in Supabase
    const { error: notifError } = await supabase
      .from('notifications')
      .insert({
        user_id,
        topic,
        title,
        body,
        data,
        sent_at: new Date().toISOString(),
        provider: 'expo',
        status: 'sent',
      });
    if (notifError) throw notifError;

    return res.status(200).json({ success: true, message: 'Notification sent', expoResult });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to send notification' });
  }
}

// TODO: Add support for OneSignal, advanced notification types, and scheduling 