import { serve } from 'bun';
import { fetchBrave } from './sites/brave';
import { fetchDuck } from './sites/duck';

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
      
      // Handle Brave endpoint
      if (req.method === 'POST' && pathname === '/brave') {
        let body;
        try {
          body = await req.json();
        } catch (e) {
          return new Response(JSON.stringify({ message: 'Invalid JSON' }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': 'https://tekir.co'
            }
          });
        }
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
        try {
          const suggestions = await fetchBrave(requestedQuery);
          return new Response(JSON.stringify(suggestions), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': 'https://tekir.co'
            }
          });
        } catch (error) {
          return new Response(JSON.stringify({ message: 'Error fetching suggestions' }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': 'https://tekir.co'
            }
          });
        }
      }
      
      // Handle DuckDuckGo endpoint
      if (req.method === 'POST' && pathname === '/duck') {
        let body;
        try {
          body = await req.json();
        } catch (e) {
          return new Response(JSON.stringify({ message: 'Invalid JSON' }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': 'https://tekir.co'
            }
          });
        }
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
        try {
          const suggestions = await fetchDuck(requestedQuery);
          return new Response(JSON.stringify(suggestions), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': 'https://tekir.co'
            }
          });
        } catch (error) {
          return new Response(JSON.stringify({ message: 'Error fetching suggestions' }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': 'https://tekir.co'
            }
          });
        }
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
