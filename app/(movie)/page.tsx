"use client";

import { useEffect, useState } from "react";
import { fetchMovies } from "../service/movie";
import Image from "next/image";
import { ChevronRight, Heart } from "lucide-react";
import HeroSection from "@/components/Hero";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { addToFavorites, isFavorite, removeFromFavorites } from "@/lib/favourite";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const MovieCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden relative">
    <Skeleton className="absolute top-3 right-3 h-9 w-9 rounded-full" />
    <Skeleton className="w-full h-[350px] rounded-t-lg" />
    <div className="pt-4 space-y-3">
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-6 w-full" />
      <div className="flex items-center gap-2 mt-2">
        <Skeleton className="h-5 w-12" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-3 w-2/3" />
    </div>
  </div>
);

export default function Home() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const getMovies = async () => {
      try {
        const data = await fetchMovies();
        setMovies(data.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
    getMovies();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchFavorites = async () => {
      try {
        const favMovies: { [key: number]: boolean } = {};
        for (const movie of movies) {
          favMovies[movie.id] = await isFavorite(user.uid, movie.id);
        }
        setFavorites(favMovies);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };
    fetchFavorites();
  }, [user, movies]);

  const handleFavorite = async (movie: any) => {
    if (!user) {
      router.push("/login");
       toast.error("You need to be logged in to add to favorite!");
      return;
    }
  
    if (!movie || typeof movie.id === "undefined") {
      toast.error("Something went wrong with the movie data.");
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
  
  const handleMovieClick = (movieId: number) => {
    if (!user) {
      router.push("/login");
       toast.error("You need to be logged in to view movie details!");
      return;
    }
    router.push(`/movie/${movieId}`);
  };

  return (
    <div className="bg-white dark:bg-[#121212] text-gray-900 dark:text-white">
      <HeroSection />
      <div className="p-4 md:p-8 lg:p-12 xl:p-24">
        <div className="flex items-center justify-between text-blue-900">
          <h1 className="text-2xl font-bold mb-6">Popular Movies</h1>
          <Link href="/movies" className="font-semibold flex justify-center items-center">See more  <ChevronRight /></Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {loading
            ? [...Array(8)].map((_, index) => <MovieCardSkeleton key={index} />)
            : movies.map((movie) => (
                <div key={movie.id} className="relative group">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavorite(movie);
                    }}
                    className="cursor-pointer absolute top-3 right-3 bg-white/60 dark:bg-gray-700/60 p-2 rounded-full z-10 transition-transform duration-300 hover:scale-110"
                  >
                    {favorites[movie.id] ? (
                      <Heart className="h-5 w-5 text-red-500" />
                    ) : (
                      <Heart className="h-5 w-5 text-gray-500 dark:text-white hover:text-red-500" />
                    )}
                  </button>
                  <div 
                    onClick={() => handleMovieClick(movie.id)} 
                    className="cursor-pointer transition-all duration-300 transform group-hover:scale-105 "
                  >
                    <div className="bg-white dark:bg-[#121212] rounded-lg overflow-hidden">
                      <div className="overflow-hidden">
                        <Image
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          width={300}
                          height={450}
                          className="w-full h-[350px] object-cover rounded-t-lg transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="pt-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          USA {movie.release_date}
                        </p>
                        <h2 className="text-lg font-semibold truncate transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">{movie.title}</h2>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="bg-yellow-500 text-white px-2 py-1 text-xs rounded">
                            IMDb
                          </span>
                          <span className="text-sm font-medium">
                            {movie.vote_average} / 10
                          </span>
                          <span className="text-red-500 text-sm">
                            🍅 {Math.round(movie.vote_average * 10)}%
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 pb-2">
                          {movie.genre_ids.slice(0, 2).join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}