"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { auth } from "@/app/firebase";
import { User, signOut } from "firebase/auth";
import { Search, User as UserIcon, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { searchMovies } from "@/app/service/movie";
import { useRouter, useSearchParams } from "next/navigation";
type Movie = {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
};
export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const timer = setTimeout(async () => {
        const results = await searchMovies(searchQuery);
        setSuggestions(results);
        setShowSuggestions(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    setSearchQuery("");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(""); 
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/30 dark:bg-black/30 backdrop-blur-md shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex justify-center items-center gap-3">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link
            href="/"
            className="text-2xl font-bold text-blue-600 dark:text-blue-400"
          >
            Filmzy
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6 flex-grow justify-center">
          <form
            onSubmit={handleSearch}
            className="relative flex items-center flex-grow max-w-xl"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search movies, TV shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-400"
              />
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
              />
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-auto">
                {suggestions.map((movie) => (
                  <Link
                    key={movie.id}
                    href={`/search?q=${encodeURIComponent(movie.title)}`}
                    className="block px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-700 transition"
                    onClick={() => setShowSuggestions(false)} 
                  >
                    {movie.title}
                  </Link>
                ))}
              </div>
            )}
          </form>
        </div>

        <div className="flex items-center space-x-3">
          <div className="md:hidden">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              {isSearchOpen ? <Search size={24} /> : <Search size={24} />}
            </button>
          </div>
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 p-0 sm:p-2 hover:bg-transparent dark:hover:bg-transparent"
              >
                {user ? (
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-gray-200 dark:border-gray-700">
                      {user.photoURL ? (
                        <AvatarImage src={user.photoURL} alt="Profile" />
                      ) : (
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                          {user.displayName
                            ? user.displayName.charAt(0).toUpperCase()
                            : "?"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-200">
                      {user.displayName || "User"}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-2">
                      <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" />
                    </div>
                    <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-200">
                      Account
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 dark:bg-gray-900 dark:border-gray-700"
            >
              {user ? (
                <>
                  <DropdownMenuItem
                    disabled
                    className="cursor-default dark:text-gray-300"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {user.displayName || "User"}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="dark:bg-gray-700" />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="cursor-pointer dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/favourite"
                      className="cursor-pointer dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      Favourite
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="dark:bg-gray-700" />
                  <DropdownMenuItem
                    onSelect={handleSignOut}
                    className="text-red-600 focus:text-red-700 dark:text-red-400 dark:focus:text-red-500 cursor-pointer"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/login"
                      className="cursor-pointer dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      Login
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/register"
                      className="cursor-pointer dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      Sign Up
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {isSearchOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-black shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <form
              onSubmit={handleSearch}
              className="relative flex items-center flex-grow max-w-xl"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search movies, TV shows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-400"
                />
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                />
              </div>

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-auto">
                  {suggestions.map((movie) => (
                    <Link
                      key={movie.id}
                      href={`/search?q=${encodeURIComponent(movie.title)}`}
                      className="block px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-700 transition"
                      onClick={() => {
                        setShowSuggestions(false);
                        setIsSearchOpen(false);
                      }}
                    >
                      {movie.title}
                    </Link>
                  ))}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-black shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <nav className="space-y-2">
              <Link
                href="/"
                className="block py-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/movies"
                className="block py-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Movies
              </Link>
              <Link
                href="/tv-shows"
                className="block py-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                TV Shows
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
