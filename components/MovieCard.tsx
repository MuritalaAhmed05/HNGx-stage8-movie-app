"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Star, Play } from "lucide-react";
import Link from "next/link";
import { getGenreNames } from "@/app/service/genres";
import { motion } from "framer-motion";
import TrailerModal from "@/components/TrailerModal";

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    poster_path: string;
    release_date?: string;
    first_air_date?: string;
    vote_average?: number;
    genre_ids?: number[];
  };
  isFavorite: boolean;
  onFavoriteToggle: (movie: any) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isFavorite,
  onFavoriteToggle,
}) => {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const releaseYear =
    movie.release_date || movie.first_air_date
      ? new Date(movie.release_date || movie.first_air_date || "").getFullYear()
      : "N/A";

  const genreNames = getGenreNames(movie.genre_ids).slice(0, 2);
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=500&auto=format&fit=crop";

  return (
    <>
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="group relative rounded-xl overflow-hidden glass-card flex flex-col h-full border border-white/10 hover:border-red-500/50 shadow-lg hover:shadow-red-500/10 transition-all"
      >
        {/* Favorite Button */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onFavoriteToggle(movie);
          }}
          className="absolute top-3 right-3 z-20 p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white hover:bg-black/80 transition-all group-hover:scale-105"
          aria-label="Save to Favorites"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-300 hover:text-red-400"
            }`}
          />
        </motion.button>

        {/* Poster Image Link & Quick Trailer Play Overlay */}
        <div className="relative aspect-[2/3] w-full overflow-hidden block">
          <Link href={`/movie/${movie.id}`}>
            <Image
              src={posterUrl}
              alt={movie.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-108 filter brightness-95 group-hover:brightness-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
          </Link>

          {/* Quick Play Trailer Hover Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsTrailerOpen(true);
            }}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="Play Trailer Pop-up"
          >
            <div className="p-3.5 rounded-full bg-red-600/90 text-white backdrop-blur-md border border-red-400/50 shadow-2xl shadow-red-600/50 hover:scale-110 transition-transform flex items-center gap-2 font-bold text-xs">
              <Play size={20} className="fill-current" />
            </div>
          </button>

          {/* Rating Badge over Poster */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-xs font-semibold text-amber-400 z-10 pointer-events-none">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</span>
          </div>
        </div>

        {/* Card Info Content */}
        <div className="p-4 flex flex-col justify-between flex-grow bg-slate-900/40">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-400 font-medium mb-1">
              <span>{releaseYear}</span>
              <span className="text-red-400/90 font-semibold">{genreNames.join(" • ")}</span>
            </div>

            <Link href={`/movie/${movie.id}`} className="block group-hover:text-red-500 transition-colors">
              <h3 className="font-semibold text-base text-gray-100 truncate line-clamp-1">
                {movie.title}
              </h3>
            </Link>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-800/40 font-mono text-[10px]">
              HD 1080p
            </span>
            <Link
              href={`/movie/${movie.id}`}
              className="text-xs text-gray-300 group-hover:text-red-400 font-medium flex items-center gap-1 transition-colors"
            >
              Details &rarr;
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Global Interactive Trailer Pop-up Modal */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        trailerKey="zSWdZVtXT7E"
        title={`${movie.title} - Official Trailer`}
      />
    </>
  );
};

export default MovieCard;
