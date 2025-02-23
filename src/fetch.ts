
export async function fetchSuggestions(query: string, count: number = 4) {
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
        return autocomplete;
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        throw error;
    }
}