"use client";

import { useState, useEffect } from "react";
import { fetchPopularTVShows } from "@/app/service/movie"; 

type TVShow = {
  id: number;
  name: string;
  poster_path: string;
  first_air_date: string;
  vote_average: number;
};

export default function TvShow() {
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getShows() {
      const shows = await fetchPopularTVShows();
      setTvShows(shows);
      setIsLoading(false);
    }

    getShows();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Popular TV Shows</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : tvShows.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tvShows.map((show) => (
            <div key={show.id} className="border rounded-lg overflow-hidden shadow-md">
              <img
                src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                alt={show.name}
                className="w-full h-auto"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{show.name}</h2>
                <p className="text-sm text-gray-600">First Aired: {show.first_air_date}</p>
                <p className="text-sm text-gray-600">Rating: {show.vote_average}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No TV shows found.</p>
      )}
    </div>
  );
}
