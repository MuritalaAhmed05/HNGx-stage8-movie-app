const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
}

export interface TMDBResponse {
  results: Movie[];
}

export const fetchMovies = async (searchTerm = "") => {
  const url = searchTerm.trim()
    ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchTerm)}`
    : `${BASE_URL}/movie/popular?api_key=${API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch movies");
  
  return response.json();
};

export const fetchMoviesByCategory = async (category: string, page = 1) => {
  let endpoint;
  if (category === "trending") {
    endpoint = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=${page}`;
  } else {
    endpoint = `${BASE_URL}/movie/${category}?api_key=${API_KEY}&page=${page}`;
  }

  const response = await fetch(endpoint);
  if (!response.ok) throw new Error("Failed to fetch movies");

  return response.json();
};

export async function searchMovies(query: string) {
  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
  );
  const data = await res.json();
  return data.results || [];
}

export async function fetchPopularTVShows() {
  try {
    const res = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}`);
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching TV shows:", error);
    return [];
  }
}