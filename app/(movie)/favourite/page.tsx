"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { getFavorites, isFavorite, addToFavorites, removeFromFavorites } from "@/lib/favourite";
import MovieCard from "@/components/MovieCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, LogIn } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";


type Movie = {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
};

export default function FavoritesPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        const favMovies = (await getFavorites(user.uid)) as Movie[];
        setMovies(favMovies);

        const favStatus: { [key: number]: boolean } = {};
        for (const movie of favMovies) {
          favStatus[movie.id] = await isFavorite(user.uid, movie.id);
        }
        setFavorites(favStatus);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const handleFavorite = async (movie: Movie) => {
    if (!user) {
      toast.error("You need to be logged in to favorite movies!");
      return;
    }

    try {
      if (favorites[movie.id]) {
        await removeFromFavorites(user.uid, movie.id);
        setFavorites((prev) => ({ ...prev, [movie.id]: false }));
        setMovies((prev) => prev.filter((m) => m.id !== movie.id));
        toast.success(`Removed "${movie.title}" from favorites.`);
      } else {
        await addToFavorites(user.uid, movie);
        setFavorites((prev) => ({ ...prev, [movie.id]: true }));
        setMovies((prev) => [...prev, movie]);
        toast.success(`Added "${movie.title}" to favorites!`);
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (!user) {
    return (
      <Card className="max-w-md mx-auto mt-10">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <Heart className="text-red-500" />
            Favorites
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">Please log in to view your favorite movies.</p>
          <Button className="w-full" variant="outline">
            <Link href="/login" className="flex justify-center items-center gap-4">
            Log In <LogIn className="mr-2" /> 
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <Heart className="text-red-500" /> Your Favorite Movies
      </h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading your favorites...</p>
        </div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={favorites[movie.id]}
              onFavoriteToggle={() => handleFavorite(movie)}
            />
          ))}
        </div>
      ) : (
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <Heart className="mx-auto mb-4 text-gray-300" size={48} />
            <p className="text-xl text-gray-600">No favorite movies yet.</p>
            <p className="text-sm text-gray-500 mt-2">
              Start exploring and add some movies to your favorites!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
