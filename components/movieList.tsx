import { useEffect, useState } from "react";

export default function MovieList({ searchTerm }: { searchTerm: string }) {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      setError("");

      try {
        let url = `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`;

        // 🔥 If user types a search term, use the search API
        if (searchTerm.trim()) {
          url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(searchTerm)}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch movies.");

        const data = await res.json();
        setMovies(data.results);
      } catch (err: any) {
        setError(err.message);
      }

      setLoading(false);
    }

    fetchMovies();
  }, [searchTerm]); // 🔥 Refetch when searchTerm changes

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && movies.length === 0 && <p>No movies found.</p>}

      {movies.map((movie) => (
        <div key={movie.id} className="bg-gray-800 p-4 rounded">
          <h2 className="text-white">{movie.title}</h2>
        </div>
      ))}
    </div>
  );
}
