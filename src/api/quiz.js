const apiUrl = import.meta.env.VITE_API_URL;
const API_BASE = apiUrl || '/api';

export async function saveQuizScore(score, accessToken, user) {
  try {
    const response = await fetch(`${API_BASE}/games`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ score, user }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save score: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in saveQuizScore:", error);
    throw error;
  }
}

export async function fetchLeaderboard(accessToken, user) {
  try {
    const username = user?.username || "";
    const response = await fetch(`${API_BASE}/games/leaderboard?username=${encodeURIComponent(username)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch leaderboard: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in fetchLeaderboard:", error);
    throw error;
  }
}
