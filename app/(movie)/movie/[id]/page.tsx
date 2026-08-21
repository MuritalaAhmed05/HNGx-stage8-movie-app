"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import YouTube from "react-youtube";
import { Star, Clock, Calendar, Play, Heart, Film, ArrowLeft, Users, DollarSign, Tag, Share2 } from "lucide-react";
import { addToFavorites, isFavorite, removeFromFavorites } from "@/lib/favourite";
import { useAuth } from "@/app/hooks/useAuth";
import { toast } from "sonner";
import { motion } from "framer-motion";
import MovieCard from "@/components/MovieCard";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  vote_count?: number;
  budget?: number;
  revenue?: number;
  tagline?: string;
  genres: { id: number; name: string }[];
  credits?: { cast: { id: number; name: string; character: string; profile_path?: string }[] };
  videos?: { results: { key: string; site: string; type: string }[] };
  similar?: { results: any[] };
}

export default function MovieDetailsPage() {
  const { id } = useParams();
  const movieId = id ? parseInt(id as string, 10) : null;
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [similarMovies, setSimilarMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    if (!movieId) return;

    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        let data: MovieDetails;

        if (API_KEY) {
          const res = await fetch(
            `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits,similar`
          );
          data = await res.json();
        } else {
          // Fallback mock details if no API key configured
          data = {
            id: movieId,
            title: "Featured Cinema Title",
            overview: "An epic cinematic thriller following Extraordinary heroes through high-stakes conflicts and stunning visual sequences.",
            poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
            backdrop_path: "/xJHokMbljvjADYdit5fK5VQsX2f.jpg",
            release_date: "2024-11-15",
            runtime: 148,
            vote_average: 8.5,
            vote_count: 12450,
            tagline: "Experience the impossible.",
            genres: [
              { id: 12, name: "Adventure" },
              { id: 878, name: "Sci-Fi" },
              { id: 18, name: "Drama" },
            ],
            credits: {
              cast: [
                { id: 1, name: "Matthew McConaughey", character: "Cooper" },
                { id: 2, name: "Anne Hathaway", character: "Brand" },
                { id: 3, name: "Jessica Chastain", character: "Murph" },
                { id: 4, name: "Michael Caine", character: "Professor Brand" },
              ],
            },
            videos: {
              results: [{ key: "zSWdZVtXT7E", site: "YouTube", type: "Trailer" }],
            },
            similar: { results: [] },
          };
        }

        setMovie(data);

        const trailer = data.videos?.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        setTrailerKey(trailer ? trailer.key : data.videos?.results[0]?.key || null);

        setSimilarMovies(data.similar?.results || []);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  useEffect(() => {
    if (!movie?.id || !user) return;

    const checkFavoriteStatus = async () => {
      try {
        const favorite = await isFavorite(user.uid, movie.id);
        setIsFavorited(favorite);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    checkFavoriteStatus();
  }, [user, movie?.id]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      router.push("/login");
      toast.error("You need to be logged in to save movies to favorites!");
      return;
    }

    if (!movie) return;

    try {
      if (isFavorited) {
        await removeFromFavorites(user.uid, movie.id);
        toast.success(`Removed "${movie.title}" from favorites.`);
        setIsFavorited(false);
      } else {
        await addToFavorites(user.uid, movie);
        toast.success(`Added "${movie.title}" to favorites!`);
        setIsFavorited(true);
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] bg-[#0b0f19]">
        <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center py-20 bg-[#0b0f19] text-white">
        <p className="text-xl">Movie not found.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 rounded-lg bg-red-600 text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop";

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=500&auto=format&fit=crop";

  return (
    <div className="bg-[#0b0f19] text-gray-100 min-h-screen pb-20">
      {/* Back Button */}
      <div className="absolute top-20 left-4 md:left-8 z-30">
        <button
          onClick={() => router.back()}
          className="px-3.5 py-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs font-semibold flex items-center gap-2 shadow-lg transition-all"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {/* Hero Backdrop Wallpaper */}
      <div className="relative w-full h-[400px] sm:h-[500px] md:h-[580px] overflow-hidden">
        <Image
          src={backdropUrl}
          alt={movie.title}
          fill
          priority
          sizes="100vw"
          className="object-cover filter brightness-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f19] via-transparent to-transparent opacity-80" />
      </div>

      {/* Main Movie Content Section */}
      <div className="container mx-auto px-4 md:px-12 -mt-48 sm:-mt-64 relative z-20 max-w-7xl">
        <div className="grid md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-8 md:gap-12">
          {/* Poster Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center md:items-start"
          >
            <div className="relative w-64 md:w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/20 glass-card">
              <Image
                src={posterUrl}
                alt={movie.title}
                fill
                sizes="(max-width: 768px) 256px, 320px"
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Details Header & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6 text-center md:text-left"
          >
            {/* Title & Tagline */}
            <div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-red-400 text-sm sm:text-base italic mt-1 font-medium">
                  &ldquo;{movie.tagline}&rdquo;
                </p>
              )}
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs sm:text-sm font-semibold">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Star size={16} className="fill-amber-400" />
                <span>{movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"} / 10</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-gray-300">
                <Clock size={16} className="text-red-400" />
                <span>{movie.runtime || 120} min</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-gray-300">
                <Calendar size={16} className="text-red-400" />
                <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}</span>
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              {movie.genres?.map((g) => (
                <span
                  key={g.id}
                  className="px-3 py-1 rounded-full bg-red-950/60 border border-red-800/40 text-red-300 text-xs font-semibold flex items-center gap-1"
                >
                  <Tag size={12} /> {g.name}
                </span>
              ))}
            </div>

            {/* Synopsis Overview */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Storyline</h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-3xl">
                {movie.overview}
              </p>
            </div>

            {/* Action Buttons: Watch Trailer & Favorite Toggle */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
              {trailerKey && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTrailer(!showTrailer)}
                  className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center gap-2 shadow-xl shadow-red-600/30 transition-all border border-red-500/40"
                >
                  <Play size={18} className="fill-current" />
                  {showTrailer ? "Close Trailer" : "Watch Official Trailer"}
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFavoriteToggle}
                className={`px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all border ${
                  isFavorited
                    ? "bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30"
                    : "glass-button text-gray-200 hover:text-white"
                }`}
              >
                <Heart size={18} className={isFavorited ? "fill-white" : ""} />
                {isFavorited ? "In Watchlist" : "Add to Watchlist"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={async () => {
                  try {
                    if (navigator.share) {
                      await navigator.share({
                        title: movie.title,
                        text: `Check out ${movie.title} on Filmzy!`,
                        url: window.location.href,
                      });
                    } else {
                      await navigator.clipboard.writeText(window.location.href);
                      toast.success("Movie link copied to clipboard!");
                    }
                  } catch (err) {
                    await navigator.clipboard.writeText(window.location.href);
                    toast.success("Movie link copied to clipboard!");
                  }
                }}
                className="px-4 py-3 rounded-xl glass-button text-gray-300 hover:text-white text-sm font-semibold flex items-center gap-2"
                aria-label="Share movie link"
              >
                <Share2 size={18} /> Share
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Embedded Trailer Section */}
        {showTrailer && trailerKey && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 p-4 glass-card rounded-2xl border border-white/15 max-w-4xl mx-auto shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Play size={18} className="text-red-500 fill-current" /> Official Trailer
              </h3>
              <button
                onClick={() => setShowTrailer(false)}
                className="text-xs text-gray-400 hover:text-white"
              >
                ✕ Close
              </button>
            </div>
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black">
              <YouTube
                videoId={trailerKey}
                className="w-full h-full"
                iframeClassName="w-full h-full rounded-xl"
              />
            </div>
          </motion.div>
        )}

        {/* Top Cast List Section */}
        {movie.credits?.cast && movie.credits.cast.length > 0 && (
          <div className="mt-16 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
              <Users size={20} className="text-red-500" /> Featured Cast
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {movie.credits.cast.slice(0, 6).map((cast) => (
                <div
                  key={cast.id}
                  className="glass-card p-3 rounded-xl text-center space-y-2 border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden bg-slate-800 border border-white/10">
                    {cast.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w185${cast.profile_path}`}
                        alt={cast.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <Users className="w-8 h-8 m-auto text-gray-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white truncate">{cast.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{cast.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar Movies Section */}
        {similarMovies.length > 0 && (
          <div className="mt-16 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
              <Film size={20} className="text-red-500" /> Similar Recommendations
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
              {similarMovies.slice(0, 5).map((sim) => (
                <MovieCard
                  key={sim.id}
                  movie={sim}
                  isFavorite={false}
                  onFavoriteToggle={() => {}}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}