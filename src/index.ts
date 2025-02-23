import { serve } from 'bun';
import { fetchSuggestions } from './fetch';

serve({
    port: process.env.PORT || 3003,
    async fetch(req) {
      if (req.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': 'https://tekir.co',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        });
      }
      const { pathname } = new URL(req.url);
      if (req.method === 'POST' && pathname === '/brave') {
        const body = await req.json();
        const requestedQuery = body.query;
        if (!requestedQuery) {
          return new Response(JSON.stringify({ message: 'You need to provide a query.' }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': 'https://tekir.co'
            }
          });
        }
        return fetchSuggestions(requestedQuery);
      }
      return new Response(JSON.stringify({ message: 'You missed the autocomplete exit.' }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'https://tekir.co'
        }
      });
    }
  });
  