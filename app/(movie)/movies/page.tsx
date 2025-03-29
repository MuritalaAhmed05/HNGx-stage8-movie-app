"use client";

import { useState, useEffect } from "react";
import { fetchMoviesByCategory } from "@/app/service/movie";
import MovieCard from "@/components/MovieCard";
import { addToFavorites, removeFromFavorites, isFavorite } from "@/lib/favourite";
import { useAuth } from "@/app/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Film, TrendingUp, Star, Clock, Play } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
type Movie = {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
};

const categories = [
  { key: "popular", label: "Popular", icon: <TrendingUp size={18} /> },
  { key: "top_rated", label: "Top Rated", icon: <Star size={18} /> },
  { key: "upcoming", label: "Upcoming", icon: <Clock size={18} /> },
  { key: "now_playing", label: "Now Playing", icon: <Play size={18} /> },
  { key: "trending", label: "Trending", icon: <Film size={18} /> },
];

export default function MoviesPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("popular");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUserFavorites = async () => {
    if (!user) return;
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

  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true);
      try {
        const data = await fetchMoviesByCategory(selectedCategory, currentPage);
        setMovies(data.results);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error("Error fetching movies:", error);
        toast.error("Failed to load movies. Please try again later.");
      } finally {
        setTimeout(() => setIsLoading(false), 300);
      }
    };

    loadMovies();
  }, [selectedCategory, currentPage]);

  useEffect(() => {
    if (user && movies.length > 0) fetchUserFavorites();
  }, [user, movies]);

  const handleFavorite = async (movie: Movie) => {
    if (!user) {
        router.push("/login")
      toast.error("You need to be logged in to add to favorite!");
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Movies Collection
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
          Discover and explore the best films from around the world
        </p>
      </motion.div>

      <div className="flex flex-wrap justify-center mb-8 gap-2">
        {categories.map((category) => (
          <motion.button
            key={category.key}
            onClick={() => {
              setSelectedCategory(category.key);
              setCurrentPage(1);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
              selectedCategory === category.key
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.label}</span>
          </motion.button>
        ))}
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="rounded-lg overflow-hidden shadow-md bg-white dark:bg-gray-800 flex flex-col">
              <Skeleton className="w-full h-64 rounded-t-lg" />
              <div className="p-4 flex-1">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-3" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-14" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && movies.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {movies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <MovieCard
                movie={movie}
                isFavorite={favorites[movie.id] ?? false}
                onFavoriteToggle={() => handleFavorite(movie)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {!isLoading && movies.length === 0 && (
        <div className="text-center py-12">
          <Film size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No movies found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            We couldn't find any movies in this category. Try another category or check back later.
          </p>
        </div>
      )}

      {!isLoading && movies.length > 0 && (
        <div className="flex flex-wrap justify-center items-center mt-10 space-x-2 space-y-2 sm:space-y-0">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
            className="rounded-full px-3"
          >
            First
          </Button>
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="rounded-full"
          >
            Previous
          </Button>
          
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Page {currentPage}
            </span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-500 dark:text-gray-400">
              {totalPages}
            </span>
          </div>
          
          <Button
            variant="outline"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="rounded-full"
          >
            Next
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(totalPages)}
            className="rounded-full px-3"
          >
            Last
          </Button>
        </div>
      )}
    </div>
  );
}