"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { motion } from "framer-motion";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  const maxPages = Math.min(totalPages, 500); // TMDB API max page limit

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= maxPages && page !== currentPage) {
      onPageChange(page);
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  // Generate visible page numbers algorithm
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 1;

    const left = currentPage - delta;
    const right = currentPage + delta + 1;

    for (let i = 1; i <= maxPages; i++) {
      if (i === 1 || i === maxPages || (i >= left && i < right)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  if (maxPages <= 1) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-12 pt-6 border-t border-white/10">
      {/* Jump to First Page */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={currentPage === 1}
        onClick={() => handlePageClick(1)}
        className="p-2.5 rounded-xl glass-button text-gray-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
        aria-label="First Page"
      >
        <ChevronsLeft size={16} />
      </motion.button>

      {/* Previous Page Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={currentPage === 1}
        onClick={() => handlePageClick(currentPage - 1)}
        className="px-3.5 py-2 rounded-xl glass-button text-xs font-bold text-gray-200 hover:text-white flex items-center gap-1 disabled:opacity-30 disabled:pointer-events-none"
      >
        <ChevronLeft size={16} /> <span className="hidden sm:inline">Prev</span>
      </motion.button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1.5 overflow-x-auto max-w-full px-1">
        {getPageNumbers().map((page, idx) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 text-xs font-bold text-gray-500">
                •••
              </span>
            );
          }

          const pageNum = Number(page);
          const isActive = pageNum === currentPage;

          return (
            <motion.button
              key={`page-${pageNum}`}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => handlePageClick(pageNum)}
              className={`min-w-[36px] h-9 px-2 rounded-xl text-xs font-black transition-all ${
                isActive
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/40 border border-red-500/50 scale-105"
                  : "bg-slate-900/80 text-gray-400 hover:text-white border border-white/10 hover:bg-slate-800"
              }`}
            >
              {pageNum}
            </motion.button>
          );
        })}
      </div>

      {/* Next Page Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={currentPage >= maxPages}
        onClick={() => handlePageClick(currentPage + 1)}
        className="px-3.5 py-2 rounded-xl glass-button text-xs font-bold text-gray-200 hover:text-white flex items-center gap-1 disabled:opacity-30 disabled:pointer-events-none"
      >
        <span className="hidden sm:inline">Next</span> <ChevronRight size={16} />
      </motion.button>

      {/* Jump to Last Page */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={currentPage >= maxPages}
        onClick={() => handlePageClick(maxPages)}
        className="p-2.5 rounded-xl glass-button text-gray-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
        aria-label="Last Page"
      >
        <ChevronsRight size={16} />
      </motion.button>
    </div>
  );
}
