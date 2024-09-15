const API_BASE_URL = "https://hacker-news.firebaseio.com/v0/";

export async function fetchLatestItemIds(type = "stories") {
  const endpoint =
    type === "jobs"
      ? "jobstories"
      : type === "polls"
      ? "pollstories"
      : "newstories";
  const response = await fetch(`${API_BASE_URL}${endpoint}.json`);
  return await response.json();
}

export async function fetchItem(id) {
  const response = await fetch(`${API_BASE_URL}item/${id}.json`);
  return await response.json();
}
