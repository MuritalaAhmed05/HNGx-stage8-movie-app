"use client"

import Link from 'next/link';
import { Film, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="relative">
          {/* Film reel background */}
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 opacity-10">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 200 200" 
              className="w-64 h-64 text-blue-200"
            >
              <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="10" />
              <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="10" />
              <circle cx="100" cy="50" r="10" fill="currentColor" />
              <circle cx="100" cy="150" r="10" fill="currentColor" />
              <circle cx="50" cy="100" r="10" fill="currentColor" />
              <circle cx="150" cy="100" r="10" fill="currentColor" />
            </svg>
          </div>

          {/* 404 Text */}
          <h1 className="text-9xl font-bold text-blue-600 relative z-10">
            404
          </h1>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-gray-800">
            Lights Out, Scene Missed!
          </h2>
          <p className="text-gray-600">
            Looks like you've wandered off the movie set. The page you're looking for 
            seems to have cut from the script.
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          <Button asChild>
            <Link href="/" className="flex items-center space-x-2">
              <Home className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </Button>

          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Reload Page</span>
          </Button>
        </div>

        {/* Fun movie-themed suggestions */}
        <div className="mt-8 bg-white/50 backdrop-blur-sm p-6 rounded-lg border border-blue-100 shadow-lg">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">
            Recommended Tracks
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-md">
              <div className="flex items-center space-x-3">
                <Film className="w-6 h-6 text-blue-500" />
                <span className="text-gray-700">Trending Movies</span>
              </div>
              <Link 
                href="/movies" 
                className="text-blue-600 hover:underline"
              >
                Browse
              </Link>
            </div>
            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-md">
              <div className="flex items-center space-x-3">
                <Film className="w-6 h-6 text-blue-500" />
                <span className="text-gray-700">Popular TV Shows</span>
              </div>
              <Link 
                href="/tv-shows" 
                className="text-blue-600 hover:underline"
              >
                Explore
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}