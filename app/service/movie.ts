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

// export const fetchMovies = async (query = ""): Promise<TMDBResponse> => {
//   const url = query
//     ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
//     : `${BASE_URL}/movie/popular?api_key=${API_KEY}`;

//   try {
//     const res = await fetch(url);
//     if (!res.ok) throw new Error(`Failed to fetch movies: ${res.statusText}`);

//     const data = await res.json();

//     // Ensure results exist and return correctly
//     return { results: Array.isArray(data.results) ? data.results : [] };
//   } catch (error) {
//     console.error("Error fetching movies:", error);
//     return { results: [] }; // Prevents app crashes
//   }
// };

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
