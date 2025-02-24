const cache: { [query: string]: any } = {};

export async function fetchDuck(query: string, count: number = 8) {
    // Check cache first
    for (const cachedQuery in cache) {
        if (cachedQuery.includes(query)) {
            return cache[cachedQuery];
        }
    }

    // If not cached, fetch from the API
    const url = `https://duckduckgo.com/ac/?q=${query}&kl=wt-wt`;
    const headers = {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:135.0) Gecko/20100101 Firefox/135.0"
    };

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        // Transform the data to match the format we want
        const autocomplete = data.slice(0, count).map((item: { phrase: string }) => ({
            query: item.phrase
        }));
        
        // Cache the result
        cache[query] = autocomplete;
        return autocomplete;
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        throw error;
    }
}
