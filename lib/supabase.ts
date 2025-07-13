import { createClient } from '@supabase/supabase-js';
import { getEnvVar } from '../utils/getEnvVar';

const supabaseUrl = getEnvVar('EXPO_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('EXPO_PUBLIC_SUPABASE_KEY');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase; 