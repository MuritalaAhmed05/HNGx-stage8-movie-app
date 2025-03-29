// "use client";

// import { useState, useEffect } from "react";
// import { fetchPopularTVShows } from "@/app/service/movie"; 
// import MovieCard from "@/components/MovieCard";

// type TVShow = {
//   id: number;
//   name: string;
//   poster_path: string;
//   first_air_date: string;
//   vote_average: number;
//   media_type: "tv"; // ✅ Explicitly mark as TV show
// };

// export default function TvShow() {
//   const [tvShows, setTvShows] = useState<TVShow[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [favorites, setFavorites] = useState<number[]>([]);

//   // Fetch TV Shows
//   useEffect(() => {
//     async function getShows() {
//       try {
//         const shows = await fetchPopularTVShows();
//         setTvShows(shows.map((show: any) => ({ ...show, media_type: "tv" }))); // ✅ Ensure media_type is "tv"
//       } catch (error) {
//         console.error("Error fetching TV shows:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     getShows();
//   }, []);

//   // Toggle Favorite
//   const toggleFavorite = (show: TVShow) => {
//     setFavorites((prev) =>
//       prev.includes(show.id) ? prev.filter((id) => id !== show.id) : [...prev, show.id]
//     );
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">Popular TV Shows</h1>

//       {isLoading ? (
//         <p className="text-center text-gray-500">Loading...</p>
//       ) : tvShows.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {tvShows.map((show) => (
//             <MovieCard
//               key={show.id}
//               movie={show}
//               isFavorite={favorites.includes(show.id)}
//               onFavoriteToggle={toggleFavorite}
//             />
//           ))}
//         </div>
//       ) : (
//         <p className="text-center text-gray-500">No TV shows found.</p>
//       )}
//     </div>
//   );
// }
import React from 'react'

export default function page() {
  return (
    <div>page</div>
  )
}
