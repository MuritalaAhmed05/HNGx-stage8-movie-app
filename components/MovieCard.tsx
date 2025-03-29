import Image from "next/image";
import { Heart } from "lucide-react";
import Link from "next/link";

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
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
  return (
    <div className="bg-white dark:bg-[#121212] rounded-lg overflow-hidden relative">
      <button
        onClick={() => onFavoriteToggle(movie)}
        className="absolute top-3 right-3 bg-white/70 dark:bg-gray-700/70 p-2 rounded-full cursor-pointer"
      >
        <Heart
          className={`h-5 w-5 ${isFavorite ? "text-red-500" : "text-gray-500"} hover:text-red-500`}
        />
      </button>

      <Link href={`/movie/${movie.id}`} passHref>
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          width={300}
          height={450}
          className="w-full h-[350px] object-cover rounded-t-lg cursor-pointer"
        />
      </Link>

      <div className="pt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          USA {movie.release_date}
        </p>
        <h2 className="text-lg font-semibold truncate">{movie.title}</h2>
        <div className="flex items-center gap-2 mt-2">
          <span className="bg-yellow-500 text-white px-2 py-1 text-xs rounded">
            IMDb
          </span>
          <span className="text-sm font-medium">{movie.vote_average} / 10</span>
          <span className="text-red-500 text-sm">
            🍅 {Math.round(movie.vote_average * 10)}%
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 pb-2">
          {movie.genre_ids?.slice(0, 2).join(", ")}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
