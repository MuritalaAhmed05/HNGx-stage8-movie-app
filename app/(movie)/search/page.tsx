"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { searchMovies } from "@/app/service/movie";
import { getFavorites, addToFavorites, removeFromFavorites } from "@/lib/favourite";
import { useAuth } from "@/app/hooks/useAuth";
import { toast } from "sonner";
import MovieCard from "@/components/MovieCard";
import { useRouter } from "next/navigation";

type Movie = {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
    genre_ids: number[];
  };
export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [movies, setMovies] = useState<Movie[]>([]);

  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  const { user } = useAuth();
    const router = useRouter();


  useEffect(() => {
    async function fetchMovies() {
      if (!query) return;

      const results = await searchMovies(query);
      setMovies(results);

      if (user) {
        const favMovies = await getFavorites(user.uid);
        const favStatus: { [key: number]: boolean } = {};
        favMovies.forEach((movie) => (favStatus[movie.id] = true));
        setFavorites(favStatus);
      }
    }
    fetchMovies();
  }, [query, user]);

  const handleFavoriteToggle = async (movie: Movie) => {
    if (!user) {
        router.push("/login")
      toast.error("You need to be logged in to favorite movies!");
      return;
    }

    try {
      if (favorites[movie.id]) {
        await removeFromFavorites(user.uid, movie.id);
        setFavorites((prev) => ({ ...prev, [movie.id]: false }));
        toast.success(`Removed "${movie.title}" from favorites.`);
      } else {
        await addToFavorites(user.uid, movie);
        setFavorites((prev) => ({ ...prev, [movie.id]: true }));
        toast.success(`Added "${movie.title}" to favorites!`);
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {query ? `Results for "${query}"` : "Search Movies"}
      </h1>

      {movies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={favorites[movie.id] || false}
              onFavoriteToggle={() => handleFavoriteToggle(movie)} 
            />
          ))}
        </div>
      ) : (
        <p>No movies found. Try another search.</p>
      )}
    </div>
  );
}
