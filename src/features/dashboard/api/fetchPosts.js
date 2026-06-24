const POSTS_URL = `${import.meta.env.VITE_API_URL}/dashboard/posts`;

export async function fetchPosts() {
  const response = await fetch(POSTS_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.status}`);
  }

  const data = await response.json();
  return data;
}
