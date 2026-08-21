"use client";

import Link from "next/link";
import Image from "next/image";
import { Film, Heart, Github, Twitter, Instagram, Globe, Sparkles } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-white/10 text-gray-400 text-xs relative z-10 overflow-hidden">
      {/* Glow highlight line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 md:px-12 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-red-600/20 border border-white/10 group-hover:scale-105 transition-transform bg-slate-900">
                <Image
                  src="/logo.png"
                  alt="Filmzy Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <span className="text-2xl font-black tracking-tight text-gradient">
                Film<span className="text-red-500">zy</span>
              </span>
            </Link>

            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              Discover blockbusters, binge-worthy series, and award-winning cinema. Track your personalized watchlist, watch trailers, and explore curated recommendations.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-900 border border-white/10 text-gray-300 hover:text-white hover:border-red-500/50 transition-colors"
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-900 border border-white/10 text-gray-300 hover:text-white hover:border-red-500/50 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={16} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-900 border border-white/10 text-gray-300 hover:text-white hover:border-red-500/50 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Quick Navigation Column */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-red-400 transition-colors">
                  Home Spotlight
                </Link>
              </li>
              <li>
                <Link href="/movies" className="hover:text-red-400 transition-colors">
                  Movies Catalog
                </Link>
              </li>
              <li>
                <Link href="/tv-shows" className="hover:text-red-400 transition-colors">
                  TV Series
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-red-400 transition-colors">
                  Search & Filters
                </Link>
              </li>
            </ul>
          </div>

          {/* Watchlist & Account Column */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Account</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/favourite" className="hover:text-red-400 transition-colors flex items-center gap-1.5">
                  <Heart size={12} className="text-red-500 fill-current" /> My Watchlist
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-red-400 transition-colors">
                  Profile Settings
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-red-400 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-red-400 transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories Column */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/movies?cat=popular" className="hover:text-red-400 transition-colors">
                  Popular Movies
                </Link>
              </li>
              <li>
                <Link href="/movies?cat=top_rated" className="hover:text-red-400 transition-colors">
                  Top Rated Films
                </Link>
              </li>
              <li>
                <Link href="/movies?cat=upcoming" className="hover:text-red-400 transition-colors">
                  Upcoming Releases
                </Link>
              </li>
              <li>
                <Link href="/tv-shows?cat=trending" className="hover:text-red-400 transition-colors">
                  Trending TV Shows
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & TMDB Attribution Notice */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <p>© {currentYear} Filmzy. Built with Next.js & TMDB API.</p>

          <p className="text-center sm:text-right max-w-md">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>
      </div>
    </footer>
  );
}
