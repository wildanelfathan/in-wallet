import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';
import { getEnvVarOptional } from '../../../utils/getEnvVar';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse query parameters for filtering
  const { category, country, search } = req.query;

  try {
    // Start building the query
    let query = supabase
      .from('bill_providers')
      .select('*');

    // Apply filters if provided
    if (category && typeof category === 'string') {
      query = query.eq('category', category);
    }

    if (country && typeof country === 'string') {
      query = query.eq('country', country);
    }

    if (search && typeof search === 'string') {
      query = query.ilike('name', `%${search}%`);
    }

    // Order by name
    query = query.order('name');

    // Execute the query
    const { data: providers, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch bill providers' });
    }

    // If DigiFlazz API key is available, we could fetch additional providers
    // from their API and merge them with our database providers
    const digiflazzApiKey = getEnvVarOptional('DIGIFLAZZ_API_KEY');
    let externalProviders: any[] = [];

    if (digiflazzApiKey && digiflazzApiKey !== 'your-digiflazz-api-key') {
      try {
        // In a real implementation, you would call the DigiFlazz API here
        // For this example, we'll just simulate some additional providers
        
        externalProviders = [
          {
            id: 'df-001',
            name: 'PLN Prepaid',
            category: 'utility',
            country: 'ID',
            logo_url: 'https://example.com/logos/pln.png',
            fields: [
              {
                key: 'meter_number',
                label: 'Meter Number',
                type: 'text',
                required: true,
                validation: '^\\d{11,12}$'
              }
            ],
            source: 'digiflazz'
          },
          {
            id: 'df-002',
            name: 'Telkomsel',
            category: 'mobile',
            country: 'ID',
            logo_url: 'https://example.com/logos/telkomsel.png',
            fields: [
              {
                key: 'phone_number',
                label: 'Phone Number',
                type: 'text',
                required: true,
                validation: '^\\d{10,13}$'
              }
            ],
            source: 'digiflazz'
          }
        ];

        // Apply the same filters to external providers
        if (category) {
          externalProviders = externalProviders.filter(p => p.category === category);
        }
        
        if (country) {
          externalProviders = externalProviders.filter(p => p.country === country);
        }
        
        if (search && typeof search === 'string') {
          externalProviders = externalProviders.filter(p => 
            p.name.toLowerCase().includes(search.toLowerCase())
          );
        }
      } catch (apiError) {
        console.error('Error fetching external providers:', apiError);
        // Continue with database providers even if external API fails
      }
    }

    // Combine providers from database and external API
    const allProviders = [
      ...(providers || []),
      ...externalProviders
    ];

    // Group providers by category for easier frontend rendering
    const groupedProviders = allProviders.reduce((acc, provider) => {
      const category = provider.category || 'other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(provider);
      return acc;
    }, {});

    return res.status(200).json({
      providers: allProviders,
      groupedProviders,
      categories: Object.keys(groupedProviders)
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 