"use client";

import { useEffect, useState } from "react";
import { getFavorites, removeFromFavorites, updateWatchStatus, FavoriteMovie, WatchStatus } from "@/lib/favourite";
import { useAuth } from "@/app/hooks/useAuth";
import MovieCard from "@/components/MovieCard";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";
import { toast } from "sonner";
import { Heart, Search, Film, LogIn, Bookmark, PlayCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_TABS: { key: string; label: string; icon: any }[] = [
  { key: "all", label: "All Items", icon: Bookmark },
  { key: "plan", label: "Plan to Watch 📌", icon: Bookmark },
  { key: "watching", label: "Watching 🍿", icon: PlayCircle },
  { key: "completed", label: "Completed 🏆", icon: CheckCircle },
];

export default function FavouritePage() {
  const { user } = useAuth();
  const [movies, setMovies] = useState<FavoriteMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    const fetchUserFavorites = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const favList = await getFavorites(user.uid);
        setMovies(favList);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        toast.error("Failed to load favorites.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserFavorites();
  }, [user]);

  const handleFavoriteToggle = async (movie: FavoriteMovie) => {
    if (!user) return;

    try {
      await removeFromFavorites(user.uid, movie.id);
      setMovies((prev) => prev.filter((m) => m.id !== movie.id));
      toast.success(`Removed "${movie.title}" from favorites.`);
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleStatusChange = async (movieId: number, newStatus: WatchStatus) => {
    if (!user) return;
    try {
      await updateWatchStatus(user.uid, movieId, newStatus);
      setMovies((prev) =>
        prev.map((m) => (m.id === movieId ? { ...m, status: newStatus } : m))
      );
      toast.success("Watch status updated!");
    } catch (err) {
      console.error(err);
    }
  };

  const filteredList = movies.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || (m.status || "plan") === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md">
        <Card className="glass-card border-white/10 text-white text-center p-8 space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
            <Heart size={32} className="fill-current" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gradient">Your Watchlist</h2>
            <p className="text-sm text-gray-400">
              Log in to access your saved movies and TV shows across all devices.
            </p>
          </div>
          <Link href="/login" className="block">
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl py-3 shadow-lg shadow-red-600/30">
              Log In to View Favorites <LogIn className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl min-h-[85vh]">
      {/* Header & Filter Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gradient flex items-center gap-3">
            <Heart className="text-red-500 fill-current" /> My Watchlist
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {movies.length} saved {movies.length === 1 ? "title" : "titles"} in your personal collection
          </p>
        </div>

        {movies.length > 0 && (
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search in favorites..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-full bg-slate-900 border border-white/15 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        )}
      </div>

      {/* Watch Status Filter Tabs */}
      {movies.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8 justify-center sm:justify-start">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedStatus(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedStatus === tab.key
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/30 border border-red-500/40"
                  : "bg-slate-900/80 text-gray-400 hover:text-white border border-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Grid Content */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
          {[...Array(4)].map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredList.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6"
        >
          <AnimatePresence>
            {filteredList.map((movie) => (
              <div key={movie.id} className="relative flex flex-col">
                <MovieCard
                  movie={movie}
                  isFavorite={true}
                  onFavoriteToggle={() => handleFavoriteToggle(movie)}
                />

                {/* Status Switcher Selector Bar */}
                <div className="mt-2 p-1.5 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-gray-400 font-semibold px-1">Status:</span>
                  <select
                    value={movie.status || "plan"}
                    onChange={(e) => handleStatusChange(movie.id, e.target.value as WatchStatus)}
                    className="bg-transparent text-white font-bold focus:outline-none cursor-pointer text-[11px]"
                  >
                    <option value="plan" className="bg-slate-900 text-white">Plan to Watch 📌</option>
                    <option value="watching" className="bg-slate-900 text-white">Watching 🍿</option>
                    <option value="completed" className="bg-slate-900 text-white">Completed 🏆</option>
                  </select>
                </div>
              </div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-20 glass-card rounded-2xl max-w-md mx-auto border border-white/10 p-8 space-y-4">
          <Film size={48} className="mx-auto text-gray-500" />
          <h3 className="text-xl font-bold text-white">
            {filterQuery ? "No Matching Favorites" : "Your Watchlist is Empty"}
          </h3>
          <p className="text-gray-400 text-sm">
            {filterQuery
              ? `No saved movies match "${filterQuery}".`
              : "Start saving movies and TV shows to build your personal streaming collection."}
          </p>
          <Link href="/" className="inline-block pt-2">
            <Button className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl px-6 py-2">
              Explore Trending Movies
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}