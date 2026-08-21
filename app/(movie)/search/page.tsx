"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo, Suspense } from "react";
import { searchMovies, Movie } from "@/app/service/movie";
import { getFavorites, addToFavorites, removeFromFavorites } from "@/lib/favourite";
import { useAuth } from "@/app/hooks/useAuth";
import { toast } from "sonner";
import MovieCard from "@/components/MovieCard";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";
import AdvancedFilterBar, { AdvancedFilterOptions } from "@/components/AdvancedFilterBar";
import { Search, SlidersHorizontal, Film, Frown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const POPULAR_TAGS = ["Action", "Sci-Fi", "Avenger", "Batman", "Spider-Man", "Anime", "Horror"];

const GENRE_OPTIONS = [
  { id: 0, label: "All Genres" },
  { id: 28, label: "Action" },
  { id: 12, label: "Adventure" },
  { id: 35, label: "Comedy" },
  { id: 18, label: "Drama" },
  { id: 27, label: "Horror" },
  { id: 878, label: "Sci-Fi" },
  { id: 53, label: "Thriller" },
];

function SearchPageContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const router = useRouter();

  const [inputQuery, setInputQuery] = useState(queryParam);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  const [selectedGenre, setSelectedGenre] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"popularity" | "rating" | "newest">("popularity");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    setInputQuery(queryParam);
  }, [queryParam]);

  useEffect(() => {
    async function fetchSearch() {
      if (!queryParam.trim()) {
        setMovies([]);
        return;
      }

      setLoading(true);
      try {
        const results = await searchMovies(queryParam);
        setMovies(results);

        if (user) {
          const favMovies = await getFavorites(user.uid);
          const favStatus: { [key: number]: boolean } = {};
          favMovies.forEach((m: any) => (favStatus[m.id] = true));
          setFavorites(favStatus);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSearch();
  }, [queryParam, user]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(inputQuery.trim())}`);
    }
  };

  const handleFavoriteToggle = async (movie: Movie) => {
    if (!user) {
      router.push("/login");
      toast.error("Please log in to save movies to your watchlist!");
      return;
    }

    try {
      if (favorites[movie.id]) {
        await removeFromFavorites(user.uid, movie.id);
        setFavorites((prev) => ({ ...prev, [movie.id]: false }));
        toast.success(`Removed "${movie.title}" from favorites.`);
      } else {
        await addToFavorites(user.uid, movie);
        setFavorites((prev) => ({ ...prev, [movie.id]: true }));
        toast.success(`Added "${movie.title}" to favorites!`);
      }
    } catch (error) {
      console.error("Favorite toggle error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const [filterOpts, setFilterOpts] = useState<AdvancedFilterOptions>({
    minRating: 0,
    releaseEra: "all",
    sortBy: "popularity",
  });

  const filteredMovies = useMemo(() => {
    let list = [...movies];

    if (selectedGenre > 0) {
      list = list.filter((m) => m.genre_ids?.includes(selectedGenre));
    }

    if (filterOpts.minRating > 0) {
      list = list.filter((m) => (m.vote_average || 0) >= filterOpts.minRating);
    }

    if (filterOpts.releaseEra !== "all") {
      list = list.filter((m) => {
        const year = new Date(m.release_date || 0).getFullYear();
        if (filterOpts.releaseEra === "2020s") return year >= 2020;
        if (filterOpts.releaseEra === "2010s") return year >= 2010 && year < 2020;
        if (filterOpts.releaseEra === "2000s") return year >= 2000 && year < 2010;
        if (filterOpts.releaseEra === "90s") return year < 2000;
        return true;
      });
    }

    if (filterOpts.sortBy === "rating") {
      list.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    } else if (filterOpts.sortBy === "newest") {
      list.sort(
        (a, b) =>
          new Date(b.release_date || 0).getTime() -
          new Date(a.release_date || 0).getTime()
      );
    }

    return list;
  }, [movies, selectedGenre, filterOpts]);

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl min-h-[80vh]">
      {/* Header Search Banner */}
      <div className="max-w-3xl mx-auto text-center mb-10 space-y-4">
        <h1 className="text-3xl md:text-5xl font-black text-gradient">
          Explore Movies & TV
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          Find millions of titles, trending shows, blockbusters, and indie gems.
        </p>

        {/* Live Search Bar Form */}
        <form onSubmit={handleFormSubmit} className="relative max-w-2xl mx-auto pt-2">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search by title, genre, or keyword..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="w-full pl-12 pr-28 py-3.5 text-sm md:text-base rounded-2xl bg-slate-900/90 border border-white/15 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition-all shadow-xl"
            />
            <Search size={22} className="absolute left-4 text-gray-400" />
            <button
              type="submit"
              className="absolute right-2 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs md:text-sm transition-all shadow-md"
            >
              Search
            </button>
          </div>
        </form>

        {/* Quick Search Suggestion Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
          <span className="text-gray-400 flex items-center gap-1 font-medium">
            <Sparkles size={13} className="text-amber-400" /> Popular Searches:
          </span>
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setInputQuery(tag);
                router.push(`/search?q=${encodeURIComponent(tag)}`);
              }}
              className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Toolbar */}
      {queryParam && (
        <div className="space-y-6">
          {/* Genre Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {GENRE_OPTIONS.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGenre(g.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedGenre === g.id
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30 border border-red-500/40"
                    : "bg-slate-900 text-gray-400 hover:text-white border border-white/10"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          <AdvancedFilterBar
            filters={filterOpts}
            onChange={setFilterOpts}
            totalResults={filteredMovies.length}
          />
        </div>
      )}

      {/* Main Results Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
          {[...Array(8)].map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredMovies.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6"
        >
          <AnimatePresence>
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isFavorite={favorites[movie.id] || false}
                onFavoriteToggle={() => handleFavoriteToggle(movie)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : queryParam ? (
        <div className="text-center py-20 glass-card rounded-2xl max-w-xl mx-auto border border-white/10 p-8 space-y-4">
          <Frown size={48} className="mx-auto text-red-500 opacity-80" />
          <h3 className="text-2xl font-bold text-white">No Movies Found</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            We couldn&apos;t find any movies matching &ldquo;{queryParam}&rdquo; with your selected filters.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setSelectedGenre(0);
                setSortBy("popularity");
              }}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs border border-white/15 transition-all"
            >
              Reset Filters & Try Again
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 glass-card rounded-2xl max-w-xl mx-auto border border-white/10 p-8 space-y-4">
          <Film size={48} className="mx-auto text-red-500/80" />
          <h3 className="text-2xl font-bold text-white">Start Your Search</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Type any movie title, actor, or genre keyword above to start exploring top-rated cinema.
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading search...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
