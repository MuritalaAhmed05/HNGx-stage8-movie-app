"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { fetchMovies, Movie } from "@/app/service/movie";
import { Dices, Sparkles, X, Star, Play, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { getGenreNames } from "@/app/service/genres";
import TrailerModal from "./TrailerModal";

interface SurpriseMeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SurpriseMeModal({ isOpen, onClose }: SurpriseMeModalProps) {
  const [pickedMovie, setPickedMovie] = useState<Movie | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const rollDice = async () => {
    setIsSpinning(true);
    try {
      // Pick random page from TMDB popular endpoint
      const randomPage = Math.floor(Math.random() * 10) + 1;
      const data = await fetchMovies("popular", randomPage);
      if (data.results && data.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        // Simulate rolling delay
        setTimeout(() => {
          setPickedMovie(data.results[randomIndex]);
          setIsSpinning(false);
        }, 800);
      }
    } catch (err) {
      console.error("Error rolling random movie:", err);
      setIsSpinning(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-lg glass-card rounded-2xl border border-white/20 shadow-2xl p-5 sm:p-6 z-10 space-y-4 my-auto max-h-[85vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30">
                  <Dices size={20} className={isSpinning ? "animate-spin" : ""} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-1.5">
                    Surprise Me! <Sparkles size={16} className="text-amber-400" />
                  </h3>
                  <p className="text-xs text-gray-400">Can&apos;t decide what to watch? Roll the dice!</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Movie Pick Result */}
            {pickedMovie ? (
              <motion.div
                key={pickedMovie.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-row gap-3.5 items-start bg-slate-900/80 p-3.5 rounded-xl border border-white/10"
              >
                <div className="relative w-24 aspect-[2/3] rounded-lg overflow-hidden flex-shrink-0 border border-white/10 shadow-md">
                  <Image
                    src={
                      pickedMovie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${pickedMovie.poster_path}`
                        : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=500"
                    }
                    alt={pickedMovie.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-1.5 text-left flex-grow min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-bold">
                    <Star size={13} className="fill-amber-400" />
                    <span>{pickedMovie.vote_average?.toFixed(1)} IMDb Score</span>
                  </div>
                  <h4 className="text-base font-bold text-white leading-snug truncate">
                    {pickedMovie.title}
                  </h4>
                  <p className="text-[11px] text-red-400 font-semibold truncate">
                    {getGenreNames(pickedMovie.genre_ids).slice(0, 2).join(" • ")}
                  </p>
                  <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                    {pickedMovie.overview}
                  </p>

                  <div className="flex items-center justify-start gap-2 pt-2">
                    <button
                      onClick={() => setIsTrailerOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1 shadow-md"
                    >
                      <Play size={14} className="fill-current" /> Trailer
                    </button>
                    <Link
                      href={`/movie/${pickedMovie.id}`}
                      onClick={onClose}
                      className="px-3 py-1.5 rounded-lg glass-button text-gray-200 hover:text-white text-xs font-semibold flex items-center gap-1"
                    >
                      Details <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500">
                  <Dices size={36} className="text-red-500" />
                </div>
                <p className="text-sm font-semibold text-gray-300">
                  Hit the button below to generate a random top-rated movie pick!
                </p>
              </div>
            )}

            {/* Roll Action Button */}
            <div className="pt-2">
              <button
                onClick={rollDice}
                disabled={isSpinning}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-red-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <Dices size={18} className={isSpinning ? "animate-spin" : ""} />
                {isSpinning ? "Spinning Movie Wheel..." : pickedMovie ? "Roll Again 🎲" : "Roll Movie Dice 🎲"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {pickedMovie && (
        <TrailerModal
          isOpen={isTrailerOpen}
          onClose={() => setIsTrailerOpen(false)}
          trailerKey="zSWdZVtXT7E"
          title={`${pickedMovie.title} - Official Trailer`}
        />
      )}
    </AnimatePresence>,
    document.body
  );
}
