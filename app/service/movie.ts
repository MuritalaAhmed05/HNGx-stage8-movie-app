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
  const baseUrl = "https://api.themoviedb.org/3";
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  
  const url = searchTerm.trim()
    ? `${baseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(searchTerm)}`
    : `${baseUrl}/movie/popular?api_key=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch movies");
  
  return response.json();
};

export const fetchMoviesByCategory = async (category: string, page = 1) => {
  const baseUrl = "https://api.themoviedb.org/3";
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  let endpoint;
  if (category === "trending") {
    endpoint = `${baseUrl}/trending/movie/week?api_key=${apiKey}&page=${page}`;
  } else {
    endpoint = `${baseUrl}/movie/${category}?api_key=${apiKey}&page=${page}`;
  }

  const response = await fetch(endpoint);
  if (!response.ok) throw new Error("Failed to fetch movies");

  return response.json();
};
