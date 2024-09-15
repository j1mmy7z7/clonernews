const API_BASE_URL = 'https://hacker-news.firebaseio.com/v0/';

export async function fetchLatestItemIds() {
    const response = await fetch(`${API_BASE_URL}newstories.json`);
    return await response.json();
}

export async function fetchItem(id) {
    const response = await fetch(`${API_BASE_URL}item/${id}.json`);
    return await response.json();
}