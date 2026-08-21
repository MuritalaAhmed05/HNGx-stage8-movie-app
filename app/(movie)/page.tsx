"use client";

import { useEffect, useState } from "react";
import { fetchMoviesByCategory, Movie } from "../service/movie";
import HeroSection from "@/components/Hero";
import MovieCard from "@/components/MovieCard";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";
import MoodPlaylists from "@/components/MoodPlaylists";
import UpcomingCountdowns from "@/components/UpcomingCountdowns";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { addToFavorites, isFavorite, removeFromFavorites } from "@/lib/favourite";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronRight, TrendingUp, Star, Play, Clock, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  { key: "popular", label: "Popular", icon: <TrendingUp size={16} /> },
  { key: "trending", label: "Trending", icon: <Flame size={16} /> },
  { key: "top_rated", label: "Top Rated", icon: <Star size={16} /> },
  { key: "now_playing", label: "Now Playing", icon: <Play size={16} /> },
  { key: "upcoming", label: "Upcoming", icon: <Clock size={16} /> },
];

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [activeCategory, setActiveCategory] = useState("popular");
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const getMovies = async () => {
      setLoading(true);
      try {
        const data = await fetchMoviesByCategory(activeCategory);
        setMovies(data.results || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
    getMovies();
  }, [activeCategory]);

  useEffect(() => {
    if (!user || movies.length === 0) return;
    const fetchFavorites = async () => {
      try {
        const favMap: { [key: number]: boolean } = {};
        for (const m of movies) {
          favMap[m.id] = await isFavorite(user.uid, m.id);
        }
        setFavorites(favMap);
      } catch (error) {
        console.error("Error checking favorites:", error);
      }
    };
    fetchFavorites();
  }, [user, movies]);

  const handleFavorite = async (movie: Movie) => {
    if (!user) {
      router.push("/login");
      toast.error("Please log in to add movies to your watchlist!");
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
    <div className="bg-[#0b0f19] text-gray-100 min-h-screen pb-20">
      {/* Featured Hero Section */}
      <HeroSection />

      {/* Main Content Area */}
      <div className="container mx-auto px-4 sm:px-6 md:px-12 pt-12 space-y-8 max-w-7xl">
        {/* Section Header & Category Selector Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-widest mb-1">
              <Flame size={14} className="fill-current" /> Curated Cinema
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gradient">
              Discover Titles
            </h2>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat.key
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30 border border-red-500/40"
                    : "bg-slate-900/80 text-gray-400 hover:text-white border border-white/10 hover:bg-slate-800"
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
            {[...Array(8)].map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : (
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
                  isFavorite={favorites[movie.id] || false}
                  onFavoriteToggle={() => handleFavorite(movie)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* View All CTA Button */}
        <div className="pt-8 text-center">
          <Link
            href="/movies"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-white/15 text-white font-semibold text-sm shadow-xl transition-all hover:scale-105"
          >
            Browse Full Movies Library <ChevronRight size={18} />
          </Link>
        </div>

        {/* Mood-Based Binge Playlists */}
        <MoodPlaylists />

        {/* Upcoming Premiere Release Countdowns */}
        <UpcomingCountdowns />
      </div>
    </div>
  );
}