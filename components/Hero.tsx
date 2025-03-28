"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchMovies, Movie } from "@/app/service/movie";
import { Skeleton } from "@/components/ui/skeleton"; // Import ShadCN Skeleton
import Link from "next/link";

export default function HeroSection() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRandomMovie = async () => {
      try {
        const data = await fetchMovies(); // TypeScript now knows data.results exists

        console.log("Fetched movies:", data);

        if (data.results.length > 0) {
          const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
          setMovie(randomMovie);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    getRandomMovie();
  }, []);

  if (loading) {
    return (
      <div className="relative w-full h-[500px] md:h-[600px] bg-gray-900">
        {/* Skeleton Background */}
        <Skeleton className="absolute inset-0 h-full w-full bg-gray-800 opacity-50" />

        {/* Skeleton Content */}
        <div className="absolute top-1/3 left-10 md:left-16 max-w-2xl">
          <Skeleton className="w-48 h-10 rounded-md bg-gray-700" />
          <Skeleton className="w-72 h-6 rounded-md bg-gray-700 mt-3" />
          <Skeleton className="w-60 h-6 rounded-md bg-gray-700 mt-2" />
          <Skeleton className="w-40 h-10 rounded-md bg-gray-700 mt-4" />
        </div>
      </div>
    );
  }

  if (!movie) return <p className="text-center text-gray-400">No movie found.</p>;

  return (
    <Link key={movie.id} href={`/movie/${movie.id}`} passHref>
        <div className="relative w-full h-[500px] md:h-[600px] text-white">
          {/* Background Image */}
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30" />
          {/* Content */}
          <div className="absolute top-1/4 left-10 md:left-16 max-w-2xl">
            <h1 className="text-4xl md:text-7xl font-bold">{movie.title}</h1>
            <p className="mt-3 text-lg max-w-lg">{movie.overview.slice(0, 150)}...</p>
            {/* Ratings */}
            <div className="flex items-center gap-3 mt-3">
              <span className="bg-yellow-400 text-black px-2 py-1 rounded-md font-bold">
                IMDb {movie.vote_average} / 10
              </span>
              <span className="text-red-500 font-bold">🍅 {Math.round(movie.vote_average * 10)}%</span>
            </div>
            {/* Watch Trailer Button */}
            <button className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-md font-semibold">
              🎬 Watch trailer
            </button>
          </div>
        </div>
    </Link>
  );
}
