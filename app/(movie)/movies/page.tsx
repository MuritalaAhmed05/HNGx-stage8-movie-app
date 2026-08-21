"use client";

import { useState, useEffect } from "react";
import { fetchMoviesByCategory, Movie } from "@/app/service/movie";
import MovieCard from "@/components/MovieCard";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";
import PaginationControls from "@/components/PaginationControls";
import { addToFavorites, removeFromFavorites, isFavorite } from "@/lib/favourite";
import { useAuth } from "@/app/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Film, TrendingUp, Star, Clock, Play, Flame } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const categories = [
  { key: "popular", label: "Popular", icon: <TrendingUp size={16} /> },
  { key: "trending", label: "Trending", icon: <Flame size={16} /> },
  { key: "top_rated", label: "Top Rated", icon: <Star size={16} /> },
  { key: "upcoming", label: "Upcoming", icon: <Clock size={16} /> },
  { key: "now_playing", label: "Now Playing", icon: <Play size={16} /> },
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
        setMovies(data.results || []);
        setTotalPages(data.total_pages || 1);
      } catch (error) {
        console.error("Error fetching movies:", error);
        toast.error("Failed to load movies. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadMovies();
  }, [selectedCategory, currentPage]);

  useEffect(() => {
    if (user && movies.length > 0) fetchUserFavorites();
  }, [user, movies]);

  const handleFavorite = async (movie: Movie) => {
    if (!user) {
      router.push("/login");
      toast.error("You need to be logged in to add to favorites!");
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
    <div className="container mx-auto px-4 py-10 max-w-7xl min-h-[85vh]">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl mx-auto mb-10 space-y-2"
      >
        <h1 className="text-3xl sm:text-5xl font-black text-gradient">
          Movies Collection
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Discover world-class cinema, box office blockbusters, and award-winning films.
        </p>
      </motion.div>

      {/* Category Pills Bar */}
      <div className="flex flex-wrap justify-center mb-10 gap-2">
        {categories.map((category) => (
          <button
            key={category.key}
            onClick={() => {
              setSelectedCategory(category.key);
              setCurrentPage(1);
            }}
            className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              selectedCategory === category.key
                ? "bg-red-600 text-white shadow-lg shadow-red-600/30 border border-red-500/40"
                : "bg-slate-900 text-gray-400 hover:text-white border border-white/10 hover:bg-slate-800"
            }`}
          >
            {category.icon}
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Movies Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
          {[...Array(8)].map((_, index) => (
            <MovieCardSkeleton key={index} />
          ))}
        </div>
      ) : movies.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6"
        >
          <AnimatePresence>
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isFavorite={favorites[movie.id] ?? false}
                onFavoriteToggle={() => handleFavorite(movie)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-20 glass-card rounded-2xl max-w-xl mx-auto border border-white/10 p-8 space-y-4">
          <Film size={48} className="mx-auto text-gray-500" />
          <h3 className="text-xl font-bold text-white">No Movies Available</h3>
          <p className="text-gray-400 text-sm">
            We couldn&apos;t load movies for this category. Please try again.
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {!isLoading && movies.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
}