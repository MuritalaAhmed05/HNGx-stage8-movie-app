"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/app/firebase";
import { User, signOut } from "firebase/auth";
import { Search, User as UserIcon, Menu, X, ChevronDown, Film, Heart, LogOut, Star, Dices } from "lucide-react";
import SurpriseMeModal from "./SurpriseMeModal";
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
import { useRouter, useSearchParams, usePathname } from "next/navigation";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
};

function HeaderContent() {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSurpriseOpen, setIsSurpriseOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const timer = setTimeout(async () => {
        const results = await searchMovies(searchQuery);
        setSuggestions(results.slice(0, 6));
        setShowSuggestions(true);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    setSearchQuery("");
    setShowSuggestions(false);
    setIsMenuOpen(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Sign out error", error);
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Movies", path: "/movies" },
    { name: "TV Shows", path: "/tv-shows" },
    { name: "Favorites", path: "/favourite" },
  ];

  return (
    <header className="sticky top-0 z-50 glass-header border-b border-white/10 shadow-2xl">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand & Mobile Hamburger */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white p-1 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-red-600/20 border border-white/10 group-hover:scale-105 transition-transform bg-slate-900">
              <Image
                src="/logo.png"
                alt="Filmzy Logo"
                fill
                className="object-contain p-1"
                priority
              />
            </div>
            <span className="text-2xl font-black tracking-tight text-gradient">
              Film<span className="text-red-500">zy</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 ml-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-red-600/20 text-red-400 border border-red-500/30"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <button
              onClick={() => setIsSurpriseOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 flex items-center gap-1.5 transition-all shadow-sm ml-1"
            >
              <Dices size={15} className="text-amber-400" /> Surprise Me 🎲
            </button>
          </nav>
        </div>

        {/* Live Search Input Component */}
        <div className="hidden md:flex items-center flex-grow max-w-md mx-6 relative">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search movies, TV shows, actors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim().length > 1 && setShowSuggestions(true)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-slate-950/80 border border-white/15 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/80 focus:ring-2 focus:ring-red-500/30 transition-all"
            />
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </form>

          {/* Autocomplete Dropdown Preview */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 border border-white/15 rounded-xl shadow-2xl backdrop-blur-xl z-50 overflow-hidden divide-y divide-white/5">
              {suggestions.map((movie) => (
                <Link
                  key={movie.id}
                  href={`/movie/${movie.id}`}
                  onClick={() => setShowSuggestions(false)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors"
                >
                  <div className="relative w-10 h-14 rounded overflow-hidden flex-shrink-0 bg-slate-800">
                    {movie.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                        alt={movie.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <Film className="w-5 h-5 m-auto text-gray-500" />
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{movie.title}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                      <span>{movie.release_date ? movie.release_date.slice(0, 4) : "N/A"}</span>
                      {movie.vote_average > 0 && (
                        <span className="flex items-center gap-1 text-amber-400 font-medium">
                          <Star size={12} className="fill-amber-400" /> {movie.vote_average.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
              <Link
                href={`/search?q=${encodeURIComponent(searchQuery)}`}
                onClick={() => setShowSuggestions(false)}
                className="block text-center py-2 text-xs font-semibold text-red-400 hover:text-red-300 bg-black/40"
              >
                View all results &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* User Profile / Auth Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden text-gray-300 hover:text-white p-2 rounded-full hover:bg-white/10"
            aria-label="Open Search"
          >
            <Search size={20} />
          </button>

          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full hover:bg-white/10 border border-white/10 text-white focus:outline-none"
              >
                {user ? (
                  <>
                    <Avatar className="h-7 w-7 border border-red-500/50">
                      {user.photoURL ? (
                        <AvatarImage src={user.photoURL} alt="Profile" />
                      ) : (
                        <AvatarFallback className="bg-red-950 text-red-400 text-xs font-bold">
                          {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="hidden sm:inline text-xs font-semibold max-w-[100px] truncate">
                      {user.displayName || user.email?.split("@")[0]}
                    </span>
                  </>
                ) : (
                  <>
                    <UserIcon className="h-4 w-4 text-gray-300" />
                    <span className="hidden sm:inline text-xs font-medium">Account</span>
                  </>
                )}
                <ChevronDown
                  size={14}
                  className={`text-gray-400 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 glass-card border border-white/15 bg-slate-900/95 text-white p-1 shadow-2xl"
            >
              {user ? (
                <>
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-xs font-semibold text-white truncate">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                  </div>

                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md hover:bg-white/10 cursor-pointer"
                    >
                      <UserIcon size={14} className="text-blue-400" /> Profile Settings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      href="/favourite"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md hover:bg-white/10 cursor-pointer"
                    >
                      <Heart size={14} className="text-red-400" /> Favorites Watchlist
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-white/10 my-1" />

                  <DropdownMenuItem
                    onSelect={handleSignOut}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md text-red-400 hover:bg-red-500/20 cursor-pointer"
                  >
                    <LogOut size={14} /> Sign Out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/login"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md hover:bg-white/10 cursor-pointer text-gray-200"
                    >
                      Log In
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/register"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md bg-red-600 text-white hover:bg-red-700 cursor-pointer mt-1"
                    >
                      Create Account
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search Expandable Bar */}
      {isSearchOpen && (
        <div className="md:hidden px-4 py-3 bg-slate-950 border-b border-white/10 animate-in slide-in-from-top duration-200">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search movies, TV shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-slate-900 border border-white/20 text-white focus:outline-none focus:border-red-500"
            />
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          </form>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-white/10 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                pathname === link.path
                  ? "bg-red-600/20 text-red-400 border border-red-500/30"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <button
            onClick={() => {
              setIsMenuOpen(false);
              setIsSurpriseOpen(true);
            }}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 flex items-center gap-2"
          >
            <Dices size={16} className="text-amber-400" /> Surprise Me 🎲
          </button>
        </div>
      )}

      {/* Global Random Movie Picker Modal */}
      <SurpriseMeModal
        isOpen={isSurpriseOpen}
        onClose={() => setIsSurpriseOpen(false)}
      />
    </header>
  );
}

export function Header() {
  return (
    <Suspense fallback={<div className="h-16 bg-slate-950 border-b border-white/10" />}>
      <HeaderContent />
    </Suspense>
  );
}

export default Header;

