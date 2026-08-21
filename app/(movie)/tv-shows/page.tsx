"use client";

import { useState, useEffect } from "react";
import { fetchPopularTVShows, Movie } from "@/app/service/movie";
import MovieCard from "@/components/MovieCard";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";
import PaginationControls from "@/components/PaginationControls";
import { addToFavorites, removeFromFavorites, isFavorite } from "@/lib/favourite";
import { useAuth } from "@/app/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tv, TrendingUp, Star, Flame } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const categories = [
  { key: "popular", label: "Popular Series", icon: <TrendingUp size={16} /> },
  { key: "trending", label: "Trending This Week", icon: <Flame size={16} /> },
  { key: "top_rated", label: "Top Rated Shows", icon: <Star size={16} /> },
];

export default function TVShowsPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("popular");
  const [tvShows, setTvShows] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadTVShows = async () => {
      setIsLoading(true);
      try {
        const results = await fetchPopularTVShows(selectedCategory, currentPage);
        setTvShows(results);
      } catch (error) {
        console.error("Error fetching TV shows:", error);
        toast.error("Failed to load TV shows.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTVShows();
  }, [selectedCategory, currentPage]);

  useEffect(() => {
    if (!user || tvShows.length === 0) return;
    const fetchUserFavorites = async () => {
      try {
        const favMap: { [key: number]: boolean } = {};
        for (const show of tvShows) {
          favMap[show.id] = await isFavorite(user.uid, show.id);
        }
        setFavorites(favMap);
      } catch (error) {
        console.error("Error checking favorites:", error);
      }
    };
    fetchUserFavorites();
  }, [user, tvShows]);

  const handleFavorite = async (show: Movie) => {
    if (!user) {
      router.push("/login");
      toast.error("Please log in to save TV shows to your watchlist!");
      return;
    }

    try {
      if (favorites[show.id]) {
        await removeFromFavorites(user.uid, show.id);
        setFavorites((prev) => ({ ...prev, [show.id]: false }));
        toast.success(`Removed "${show.title}" from favorites.`);
      } else {
        await addToFavorites(user.uid, show);
        setFavorites((prev) => ({ ...prev, [show.id]: true }));
        toast.success(`Added "${show.title}" to favorites!`);
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl min-h-[85vh]">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl mx-auto mb-10 space-y-2"
      >
        <h1 className="text-3xl sm:text-5xl font-black text-gradient">
          TV Shows & Series
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Stream binge-worthy television dramas, comedies, and trending miniseries.
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

      {/* Grid Display */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
          {[...Array(8)].map((_, index) => (
            <MovieCardSkeleton key={index} />
          ))}
        </div>
      ) : tvShows.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6"
        >
          <AnimatePresence>
            {tvShows.map((show) => (
              <MovieCard
                key={show.id}
                movie={show}
                isFavorite={favorites[show.id] ?? false}
                onFavoriteToggle={() => handleFavorite(show)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-20 glass-card rounded-2xl max-w-xl mx-auto border border-white/10 p-8 space-y-4">
          <Tv size={48} className="mx-auto text-gray-500" />
          <h3 className="text-xl font-bold text-white">No TV Shows Found</h3>
          <p className="text-gray-400 text-sm">
            We couldn&apos;t load TV series right now. Please try switching category.
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {!isLoading && tvShows.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={500}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
}
