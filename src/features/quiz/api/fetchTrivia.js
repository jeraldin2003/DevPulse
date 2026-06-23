const TRIVIA_URL = 'https://opentdb.com/api.php?amount=10';

export async function fetchTrivia() {
  try {
    const response = await fetch(TRIVIA_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch trivia: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in fetchTrivia:', error);
    throw error;
  }
}
