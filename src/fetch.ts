const cache: { [query: string]: any } = {};

export async function fetchSuggestions(query: string, count: number = 4) {
    for (const cachedQuery in cache) {
        if (cachedQuery.includes(query)) {
            return cache[cachedQuery];
        }
    }

    // If not cached, fetch from the API.
    const url = `https://api.search.brave.com/res/v1/suggest/search?q=${query}&count=${count}`;
    const headers = {
        "Accept": "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": process.env.BRAVE_API_KEY || '',
    };

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        const autocomplete = data.results;
        // Cache the result with the query as key.
        cache[query] = autocomplete;
        return autocomplete;
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        throw error;
    }
}