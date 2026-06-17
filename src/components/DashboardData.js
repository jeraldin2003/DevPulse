import { fetchUsers } from "../api/fetchUsers.js";
import { fetchPosts } from "../api/fetchPosts.js";
import { fetchTodos } from "../api/fetchTodos.js";
import { fetchTrivia } from "../api/fetchTrivia.js";

import { userStats } from "../modules/userStats.js";
import { postAnalysis } from "../modules/postAnalysis.js";
import { productivityTracker } from "../modules/productivityTracker.js";
import { triviaScorer } from "../modules/triviaScorer.js";

export async function fetchOverviewData() {
  const start = Date.now();
  const [usersRes, postsRes, todosRes, triviaRes] = await Promise.allSettled([
    fetchUsers(),
    fetchPosts(),
    fetchTodos(),
    fetchTrivia(),
  ]);

  const errors = {};
  const data = {};

  if (usersRes.status === "fulfilled") data.users = userStats(usersRes.value);
  else errors.users = usersRes.reason?.message ?? "Unknown error";

  if (postsRes.status === "fulfilled") data.posts = postAnalysis(postsRes.value);
  else errors.posts = postsRes.reason?.message ?? "Unknown error";

  if (usersRes.status === "fulfilled" && todosRes.status === "fulfilled") {
    data.productivity = productivityTracker(usersRes.value, todosRes.value);
  } else if (todosRes.status === "rejected") {
    errors.productivity = todosRes.reason?.message ?? "Unknown error";
  }

  if (triviaRes.status === "fulfilled") data.trivia = triviaScorer(triviaRes.value);
  else errors.trivia = triviaRes.reason?.message ?? "Unknown error";

  return { data, errors, loadTime: Date.now() - start };
}

export async function fetchUsersData() {
  const start = Date.now();
  try {
    const raw = await fetchUsers();
    // console.log(raw)
    return { data: userStats(raw), errors: {}, loadTime: Date.now() - start };
  } catch (e) {
    return { data: null, errors: { users: e.message ?? "Unknown error" }, loadTime: Date.now() - start };
  }
}

export async function fetchPostsData() {
  const start = Date.now();
  try {
    const raw = await fetchPosts();
    return { data: postAnalysis(raw), errors: {}, loadTime: Date.now() - start };
  } catch (e) {
    return { data: null, errors: { posts: e.message ?? "Unknown error" }, loadTime: Date.now() - start };
  }
}

export async function fetchProductivityData() {
  const start = Date.now();
  const [usersRes, todosRes] = await Promise.allSettled([fetchUsers(), fetchTodos()]);

  if (usersRes.status === "fulfilled" && todosRes.status === "fulfilled") {
    // console.log(productivityTracker(usersRes.value, todosRes.value))
    return {
      data: productivityTracker(usersRes.value, todosRes.value),
      errors: {},
      loadTime: Date.now() - start,
    };
  }

  const errors = {};
  if (usersRes.status === "rejected") errors.productivity = usersRes.reason?.message ?? "Unknown error";
  if (todosRes.status === "rejected") errors.productivity = todosRes.reason?.message ?? "Unknown error";

  return { data: null, errors, loadTime: Date.now() - start };
}

export async function fetchTriviaData() {
  const start = Date.now();
  try {
    const raw = await fetchTrivia();
    return { data: triviaScorer(raw), errors: {}, loadTime: Date.now() - start };
  } catch (e) {
    return { data: null, errors: { trivia: e.message ?? "Unknown error" }, loadTime: Date.now() - start };
  }
}

export async function fetchCountriesData() {
  const start = Date.now();
  try {
    const raw = await fetchCountries();
    return { data: countryLookup(raw), errors: {}, loadTime: Date.now() - start };
  } catch (e) {
    return { data: null, errors: { countries: e.message ?? "Unknown error" }, loadTime: Date.now() - start };
  }
}