"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import YouTube from "react-youtube";
import { Star, Clock, Calendar, Play } from "lucide-react";
import {
  addToFavorites,
  isFavorite,
  removeFromFavorites,
} from "@/lib/favourite";
import { useAuth } from "@/app/hooks/useAuth";

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
  genres: { id: number; name: string }[];
  credits: { cast: { id: number; name: string }[] };
  videos: { results: { key: string; site: string; type: string }[] };
  similar: { results: SimilarMovie[] };
}

interface SimilarMovie {
  id: number;
  title: string;
  poster_path?: string;
}

export default function MovieDetailsPage() {
  const { id } = useParams();
  const movieId = id ? parseInt(id as string, 10) : null;
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [trailer, setTrailer] = useState<string | null>(null);
  const [similarMovies, setSimilarMovies] = useState<SimilarMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loadings } = useAuth();
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (!movieId) return;

    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits,similar`
        );
        const data: MovieDetails = await res.json();
        setMovie(data);

        // Get Trailer
        const officialTrailer = data.videos?.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        setTrailer(officialTrailer ? officialTrailer.key : null);

        // Get Similar Movies
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
    if (!loading && !user) {
      router.push("/login");
      return;
    }
  
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
  }, [user, movie?.id, loading, router]);
  

  const handleFavorite = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!movie) return;

    try {
      if (isFavorited) {
        await removeFromFavorites(user.uid, movie.id);
        setIsFavorited(false);
      } else {
        await addToFavorites(user.uid, movie);
        setIsFavorited(true);
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );

  if (!movie) return <p className="text-center p-6">Movie not found.</p>;

  return (
    <div className="bg-blue-600/70 text-gray-900 min-h-screen">
      {/* Backdrop Image */}
      <div className="relative w-full h-[500px] overflow-hidden">
        {movie.backdrop_path && (
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            fill
            className="absolute inset-0 object-cover filter brightness-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
      </div>

      {/* Movie Content */}
      <div className="container mx-auto px-4 -mt-64 relative z-10">
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          {/* Poster */}
          {movie.poster_path && (
            <div className="hidden md:block">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={300}
                height={450}
                className="rounded-xl shadow-2xl border-4 border-white"
              />
            </div>
          )}

          {/* Movie Details */}
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">
              {movie.title}
            </h1>

            {/* Metadata */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-lg font-semibold">
                  {movie.vote_average.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-300" />
                <span>{movie.runtime} min</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-green-300" />
                <span>{new Date(movie.release_date).getFullYear()}</span>
              </div>
            </div>

            {/* Overview */}
            <p className="text-gray-200 mb-6 max-w-2xl">{movie.overview}</p>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Watch Trailer</span>
              </button>
              <button
                className={`px-6 py-3 rounded-lg transition-colors ${
                  isFavorited
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
                onClick={handleFavorite}
              >
                {isFavorited ? "Remove from Favorites ❤️" : "Add to Favorites"}
              </button>
            </div>
          </div>
        </div>

        {/* Trailer */}
        {trailer && (
          <div className="mt-12 bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
            <YouTube videoId={trailer} className="w-full aspect-video" />
          </div>
        )}
      </div>

      <div className="mt-16 px-6 md:px-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Similar Movies</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {similarMovies.slice(0, 4).map((similar) => (
              <div 
                key={similar.id} 
                className="group relative overflow-hidden rounded-lg shadow-lg"
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w300${similar.poster_path}`}
                  alt={similar.title}
                  width={300}
                  height={450}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-white font-semibold">{similar.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}
