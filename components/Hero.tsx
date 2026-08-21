"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchMovies, Movie } from "@/app/service/movie";
import { getGenreNames } from "@/app/service/genres";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Info, Star, Calendar, Flame } from "lucide-react";
import { motion } from "framer-motion";
import TrailerModal from "@/components/TrailerModal";

export default function HeroSection() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  useEffect(() => {
    const getRandomMovie = async () => {
      try {
        const data = await fetchMovies();
        if (data.results && data.results.length > 0) {
          const moviesWithBackdrop = data.results.filter((m) => m.backdrop_path);
          const selected =
            moviesWithBackdrop.length > 0
              ? moviesWithBackdrop[Math.floor(Math.random() * moviesWithBackdrop.length)]
              : data.results[0];
          setMovie(selected);
        }
      } catch (error) {
        console.error("Error fetching hero movie:", error);
      } finally {
        setLoading(false);
      }
    };

    getRandomMovie();
  }, []);

  if (loading) {
    return (
      <div className="relative w-full h-[550px] md:h-[650px] bg-slate-950 overflow-hidden">
        <Skeleton className="absolute inset-0 w-full h-full bg-slate-900 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute bottom-16 left-6 md:left-16 max-w-2xl space-y-4">
          <Skeleton className="w-32 h-6 rounded-full bg-slate-800" />
          <Skeleton className="w-80 md:w-96 h-12 rounded-xl bg-slate-800" />
          <Skeleton className="w-full h-16 rounded-lg bg-slate-800" />
          <div className="flex gap-4">
            <Skeleton className="w-36 h-12 rounded-xl bg-slate-800" />
            <Skeleton className="w-36 h-12 rounded-xl bg-slate-800" />
          </div>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop";

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "2025";
  const genres = getGenreNames(movie.genre_ids).slice(0, 3);

  return (
    <>
      <div className="relative w-full h-[550px] md:h-[650px] lg:h-[700px] overflow-hidden text-white bg-slate-950">
        {/* Backdrop Image */}
        <div className="absolute inset-0">
          <Image
            src={backdropUrl}
            alt={movie.title}
            fill
            priority
            sizes="100vw"
            className="object-cover filter brightness-75 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/30 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 md:px-12 h-full flex items-end pb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl space-y-4"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-600/40 border border-red-500/30">
                <Flame size={14} className="fill-current text-amber-300" /> Featured Spotlight
              </span>

              <div className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                <span className="flex items-center gap-1 text-amber-400">
                  <Star size={16} className="fill-amber-400" />
                  {movie.vote_average ? movie.vote_average.toFixed(1) : "8.2"}
                </span>
                <span className="text-gray-500">•</span>
                <span className="flex items-center gap-1 text-gray-300">
                  <Calendar size={14} /> {releaseYear}
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-red-400 text-xs font-medium">{genres.join(", ")}</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow-2xl leading-none">
              {movie.title}
            </h1>

            <p className="text-gray-300 text-sm md:text-base line-clamp-3 md:line-clamp-4 leading-relaxed font-normal max-w-xl text-shadow">
              {movie.overview ||
                "Experience an unforgettable cinematic voyage packed with breathtaking action, compelling character drama, and high-stakes adventure."}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsTrailerOpen(true)}
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center gap-2.5 shadow-xl shadow-red-600/30 transition-all border border-red-500/40"
              >
                <Play size={18} className="fill-current" /> Watch Trailer Pop-up
              </motion.button>

              <Link href={`/movie/${movie.id}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-xl glass-button text-gray-200 hover:text-white font-semibold text-sm flex items-center gap-2"
                >
                  <Info size={18} /> Details Page
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        trailerKey="zSWdZVtXT7E"
        title={`${movie.title} - Official Trailer`}
      />
    </>
  );
}
