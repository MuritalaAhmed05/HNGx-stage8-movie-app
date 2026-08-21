"use client";

import { useEffect, useState } from "react";
import { fetchMovies, Movie } from "@/app/service/movie";
import { Calendar, Clock, Bell, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function UpcomingCountdowns() {
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUpcoming = async () => {
      try {
        const data = await fetchMovies("upcoming", 1);
        if (data.results) {
          setUpcomingMovies(data.results.slice(0, 3));
        }
      } catch (err) {
        console.error("Error loading upcoming movies:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUpcoming();
  }, []);

  if (loading || upcomingMovies.length === 0) return null;

  return (
    <div className="space-y-6 my-16">
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
          <Calendar className="text-red-500" size={24} /> Upcoming Premiere Countdowns ⏳
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Track upcoming worldwide theater releases and add release reminders.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {upcomingMovies.map((movie, idx) => {
          const releaseDateStr = movie.release_date || "2026-09-15";
          const releaseDate = new Date(releaseDateStr);
          const daysLeft = Math.max(
            1,
            Math.ceil((releaseDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24))
          );

          return (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card rounded-2xl overflow-hidden border border-white/10 p-4 flex gap-4 items-center relative group hover:border-red-500/50 transition-all"
            >
              <div className="relative w-20 aspect-[2/3] rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                <Image
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=500"
                  }
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-2 flex-grow min-w-0">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-black uppercase tracking-wider">
                  <Clock size={10} /> Releasing in {daysLeft} Days
                </span>

                <h4 className="text-base font-bold text-white truncate group-hover:text-red-400 transition-colors">
                  {movie.title}
                </h4>

                <p className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                  <Calendar size={12} className="text-gray-500" /> Release: {releaseDateStr}
                </p>

                <div className="pt-1 flex items-center gap-2">
                  <button
                    onClick={() => toast.success(`Reminder set for "${movie.title}" release date!`)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-gray-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Bell size={13} className="text-amber-400" /> Set Reminder
                  </button>

                  <Link
                    href={`/movie/${movie.id}`}
                    className="text-xs text-red-400 hover:underline font-semibold"
                  >
                    Info &rarr;
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
