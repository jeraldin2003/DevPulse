import { fetchUsers } from "../api/fetchUsers.js";
import { fetchPosts } from "../api/fetchPosts.js";
import { fetchTodos } from "../api/fetchTodos.js";
import { fetchTrivia } from "../api/fetchTrivia.js";
import { fetchCountries } from "../api/fetchCountries.js";

import { userStats } from "../modules/userStats.js";
import { postAnalysis } from "../modules/postAnalysis.js";
import { productivityTracker } from "../modules/productivityTracker.js";
import { triviaScorer } from "../modules/triviaScorer.js";
import { countryLookup } from "../modules/countryLookup.js";

export async function fetchDashboardData() {
    const start = Date.now();
  
    const [usersRes, postsRes, todosRes, triviaRes, countriesRes] =
      await Promise.allSettled([
        fetchUsers(),
        fetchPosts(),
        fetchTodos(),
        fetchTrivia(),
        fetchCountries(),
      ]);
  
    const nextErrors = {};
    const raw = {};
  
    if (usersRes.status === "fulfilled") {
      raw.users = usersRes.value;
    } else {
      nextErrors.users = usersRes.reason?.message ?? "Unknown error";
    }
  
    if (postsRes.status === "fulfilled") {
      raw.posts = postsRes.value;
    } else {
      nextErrors.posts = postsRes.reason?.message ?? "Unknown error";
    }
  
    if (todosRes.status === "fulfilled") {
      raw.todos = todosRes.value;
    } else {
      nextErrors.todos = todosRes.reason?.message ?? "Unknown error";
    }
  
    if (triviaRes.status === "fulfilled") {
      raw.trivia = triviaRes.value;
    } else {
      nextErrors.trivia = triviaRes.reason?.message ?? "Unknown error";
    }
  
    if (countriesRes.status === "fulfilled") {
      raw.countries = countriesRes.value;
    } else {
      nextErrors.countries = countriesRes.reason?.message ?? "Unknown error";
    }
  
    const nextData = {};
  
    if (raw.users) {
      nextData.users = userStats(raw.users);
    }
  
    if (raw.posts) {
      nextData.posts = postAnalysis(raw.posts);
    }
  
    if (raw.users && raw.todos) {
      nextData.productivity = productivityTracker(raw.users, raw.todos);
    } else if (!raw.users && raw.todos) {
      nextErrors.productivity = "Users data required for productivity stats";
    } else if (raw.users && !raw.todos) {
      nextErrors.productivity = "Todos data required for productivity stats";
    }
  
    if (raw.trivia) {
      nextData.trivia = triviaScorer(raw.trivia);
    }
  
    if (raw.countries) {
      nextData.countries = countryLookup(raw.countries);
    }
  
    return {
      dashData: nextData,
      errors: nextErrors,
      loadTime: Date.now() - start,
    };
  }
  