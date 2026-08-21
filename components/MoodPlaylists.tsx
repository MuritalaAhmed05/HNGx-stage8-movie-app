"use client";

import { useState, useEffect } from "react";
import { fetchMovies, Movie } from "@/app/service/movie";
import MovieCard from "./MovieCard";
import MovieCardSkeleton from "./MovieCardSkeleton";
import { Sparkles, Zap, Brain, Moon, Laugh, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const MOODS = [
  { id: "adrenaline", label: "Adrenaline Rush ⚡", genreId: 28, icon: Zap, color: "from-amber-500 to-red-600" },
  { id: "scifi", label: "Mind-Bending Sci-Fi 🧠", genreId: 878, icon: Brain, color: "from-purple-500 to-indigo-600" },
  { id: "thriller", label: "Late Night Thrillers 🌙", genreId: 53, icon: Moon, color: "from-rose-600 to-slate-900" },
  { id: "comedy", label: "Feel Good Comedies 😂", genreId: 35, icon: Laugh, color: "from-yellow-400 to-orange-500" },
  { id: "drama", label: "Epic Storytelling 📜", genreId: 18, icon: BookOpen, color: "from-cyan-500 to-blue-600" },
];

export default function MoodPlaylists() {
  const [selectedMood, setSelectedMood] = useState(MOODS[0]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMoodMovies = async () => {
      setLoading(true);
      try {
        const data = await fetchMovies("popular", 1);
        if (data.results) {
          const filtered = data.results.filter((m) =>
            m.genre_ids?.includes(selectedMood.genreId)
          );
          setMovies(filtered.length > 0 ? filtered.slice(0, 4) : data.results.slice(0, 4));
        }
      } catch (err) {
        console.error("Error loading mood movies:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMoodMovies();
  }, [selectedMood]);

  return (
    <div className="space-y-6 my-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Sparkles className="text-amber-400 fill-amber-400" size={24} /> Mood-Based Playlists 🍿
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Pick your current vibe and dive straight into matching blockbusters.
          </p>
        </div>

        {/* Mood Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {MOODS.map((m) => {
            const isSelected = selectedMood.id === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMood(m)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30 border border-red-500/50 scale-105"
                    : "bg-slate-900 text-gray-400 hover:text-white border border-white/10"
                }`}
              >
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mood Movie Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={false}
              onFavoriteToggle={() => {}}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
