const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path?: string;
  overview?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  vote_count?: number;
  media_type?: string;
}

export interface TMDBResponse {
  results: Movie[];
  total_pages?: number;
  total_results?: number;
}

// Fallback high quality movie list if TMDB key is missing or offline
const FALLBACK_MOVIES: Movie[] = [
  {
    id: 550,
    title: "Fight Club",
    poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    backdrop_path: "/hZk2Q1PSczTQwOHKV4c1z9vWvWz.jpg",
    overview: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
    vote_average: 8.4,
    release_date: "1999-10-15",
    genre_ids: [18, 53],
  },
  {
    id: 157336,
    title: "Interstellar",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "/xJHokMbljvjADYdit5fK5VQsX2f.jpg",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel.",
    vote_average: 8.6,
    release_date: "2014-11-05",
    genre_ids: [12, 18, 878],
  },
  {
    id: 27205,
    title: "Inception",
    poster_path: "/oYuLEW9WAFB1B2ex9vY929x8s7.jpg",
    backdrop_path: "/s3TBrRGB1iav7ySaNuSpIZScYio.jpg",
    overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life.",
    vote_average: 8.367,
    release_date: "2010-07-15",
    genre_ids: [28, 12, 878],
  },
  {
    id: 155,
    title: "The Dark Knight",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop_path: "/nMKmy8FiGiBhwuU8CQh523OP89W.jpg",
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
    vote_average: 8.515,
    release_date: "2008-07-16",
    genre_ids: [18, 28, 80, 53],
  },
  {
    id: 299536,
    title: "Avengers: Infinity War",
    poster_path: "/7WsyChLLEzcqIFZ23dM8wW1u2fE.jpg",
    backdrop_path: "/m6J32Vzg6aC4hXgR4E523OP89W.jpg",
    overview: "As the Avengers and their allies have continued to protect the world from threats too large for any one hero to handle, a new danger has emerged from the cosmic shadows: Thanos.",
    vote_average: 8.252,
    release_date: "2018-04-25",
    genre_ids: [12, 28, 878],
  },
  {
    id: 671,
    title: "Harry Potter and the Philosopher's Stone",
    poster_path: "/wuMc08IPKEatf9rnMNXvIDxqP4W.jpg",
    backdrop_path: "/hziih1vLchvBv2pT5719n96m2.jpg",
    overview: "Harry Potter has lived under the stairs at his aunt and uncle's house his whole life. But on his 11th birthday, he learns he's a powerful wizard.",
    vote_average: 7.915,
    release_date: "2001-11-16",
    genre_ids: [12, 14],
  },
  {
    id: 19995,
    title: "Avatar",
    poster_path: "/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
    backdrop_path: "/vL5LR6WBLseTJ5gW33xK1WvWz.jpg",
    overview: "In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization.",
    vote_average: 7.58,
    release_date: "2009-12-15",
    genre_ids: [28, 12, 14, 878],
  },
  {
    id: 496243,
    title: "Parasite",
    poster_path: "/7IiT9Z9wvWzE3tdsq5PzW9.jpg",
    backdrop_path: "/hiE81Z9wvWzE3tdsq5PzW9.jpg",
    overview: "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
    vote_average: 8.5,
    release_date: "2019-05-30",
    genre_ids: [35, 53, 18],
  }
];

export const fetchMovies = async (searchTerm = ""): Promise<TMDBResponse> => {
  if (!API_KEY) {
    console.warn("NEXT_PUBLIC_TMDB_API_KEY is not configured. Using fallback movies data.");
    const filtered = searchTerm.trim()
      ? FALLBACK_MOVIES.filter((m) =>
          m.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : FALLBACK_MOVIES;
    return { results: filtered, total_pages: 1, total_results: filtered.length };
  }

  try {
    const url = searchTerm.trim()
      ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchTerm)}`
      : `${BASE_URL}/movie/popular?api_key=${API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch movies");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movies from TMDB:", error);
    const filtered = searchTerm.trim()
      ? FALLBACK_MOVIES.filter((m) =>
          m.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : FALLBACK_MOVIES;
    return { results: filtered, total_pages: 1, total_results: filtered.length };
  }
};

export const fetchMoviesByCategory = async (category: string, page = 1): Promise<TMDBResponse> => {
  if (!API_KEY) {
    return { results: FALLBACK_MOVIES, total_pages: 1, total_results: FALLBACK_MOVIES.length };
  }

  try {
    let endpoint = `${BASE_URL}/movie/${category}?api_key=${API_KEY}&page=${page}`;
    if (category === "trending") {
      endpoint = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=${page}`;
    }

    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("Failed to fetch movies by category");
    return await response.json();
  } catch (error) {
    console.error(`Error fetching category ${category}:`, error);
    return { results: FALLBACK_MOVIES, total_pages: 1, total_results: FALLBACK_MOVIES.length };
  }
};

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query.trim()) return [];
  
  if (!API_KEY) {
    return FALLBACK_MOVIES.filter((m) =>
      m.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  try {
    const res = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );
    if (!res.ok) throw new Error("Search failed");
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Error searching movies:", error);
    return FALLBACK_MOVIES.filter((m) =>
      m.title.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export async function fetchPopularTVShows(category = "popular", page = 1): Promise<Movie[]> {
  if (!API_KEY) {
    return FALLBACK_MOVIES.map((m) => ({
      ...m,
      title: m.title + " (Series)",
    }));
  }

  try {
    const endpoint = category === "trending"
      ? `${BASE_URL}/trending/tv/week?api_key=${API_KEY}&page=${page}`
      : `${BASE_URL}/tv/${category}?api_key=${API_KEY}&page=${page}`;

    const res = await fetch(endpoint);
    if (!res.ok) throw new Error("Failed to fetch TV shows");
    const data = await res.json();
    return (data.results || []).map((show: any) => ({
      ...show,
      title: show.name || show.title,
      release_date: show.first_air_date || show.release_date,
    }));
  } catch (error) {
    console.error("Error fetching TV shows:", error);
    return [];
  }
}