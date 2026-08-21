"use client";

import React from "react";
import { SlidersHorizontal, Star, Calendar, Filter } from "lucide-react";

export interface AdvancedFilterOptions {
  minRating: number;
  releaseEra: string;
  sortBy: "popularity" | "rating" | "newest";
}

interface AdvancedFilterBarProps {
  filters: AdvancedFilterOptions;
  onChange: (newFilters: AdvancedFilterOptions) => void;
  totalResults?: number;
}

const RATING_PILLS = [
  { value: 0, label: "All Ratings" },
  { value: 7, label: "7.0+ ★" },
  { value: 8, label: "8.0+ ★" },
  { value: 8.5, label: "8.5+ Masterpieces" },
];

const ERA_PILLS = [
  { value: "all", label: "All Eras" },
  { value: "2020s", label: "2020s" },
  { value: "2010s", label: "2010s" },
  { value: "2000s", label: "2000s" },
  { value: "90s", label: "90s & Older" },
];

export default function AdvancedFilterBar({
  filters,
  onChange,
  totalResults,
}: AdvancedFilterBarProps) {
  return (
    <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-4 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
          <Filter size={14} className="text-red-500" /> Filter & Sort Controls
          {typeof totalResults === "number" && (
            <span className="text-gray-400 font-normal lowercase">({totalResults} titles found)</span>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 self-start sm:self-auto">
          <SlidersHorizontal size={14} className="text-gray-400" />
          <span className="text-xs text-gray-400 font-medium">Sort by:</span>
          <select
            value={filters.sortBy}
            onChange={(e: any) => onChange({ ...filters, sortBy: e.target.value })}
            className="bg-transparent text-xs text-white font-bold focus:outline-none cursor-pointer"
            aria-label="Sort movies by"
          >
            <option value="popularity" className="bg-slate-900 text-white">Most Popular</option>
            <option value="rating" className="bg-slate-900 text-white">Highest Rating</option>
            <option value="newest" className="bg-slate-900 text-white">Newest Release</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rating Score Pills */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <Star size={12} className="text-amber-400" /> Minimum IMDb Score
          </label>
          <div className="flex flex-wrap gap-1.5">
            {RATING_PILLS.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => onChange({ ...filters, minRating: r.value })}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filters.minRating === r.value
                    ? "bg-red-600 text-white shadow-md border border-red-500/40"
                    : "bg-slate-900 text-gray-400 hover:text-white border border-white/10"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Release Era Pills */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <Calendar size={12} className="text-red-400" /> Release Era
          </label>
          <div className="flex flex-wrap gap-1.5">
            {ERA_PILLS.map((e) => (
              <button
                key={e.value}
                type="button"
                onClick={() => onChange({ ...filters, releaseEra: e.value })}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filters.releaseEra === e.value
                    ? "bg-red-600 text-white shadow-md border border-red-500/40"
                    : "bg-slate-900 text-gray-400 hover:text-white border border-white/10"
                }`}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
