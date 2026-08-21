"use client";

import { X, Play } from "lucide-react";
import YouTube from "react-youtube";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trailerKey: string | null;
  title?: string;
}

export default function TrailerModal({
  isOpen,
  onClose,
  trailerKey,
  title = "Movie Trailer",
}: TrailerModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-4xl glass-card rounded-2xl border border-white/20 shadow-2xl overflow-hidden z-10"
          >
            {/* Header Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-red-600/20 text-red-500 border border-red-500/30">
                  <Play size={16} className="fill-current" />
                </div>
                <h3 className="text-base font-bold text-white truncate max-w-md">
                  {title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors"
                aria-label="Close Trailer Modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Video Player Container */}
            <div className="relative aspect-video w-full bg-black">
              {trailerKey ? (
                <YouTube
                  videoId={trailerKey}
                  opts={{
                    playerVars: {
                      autoplay: 1,
                      modestbranding: 1,
                      rel: 0,
                    },
                  }}
                  className="w-full h-full"
                  iframeClassName="w-full h-full"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-2">
                  <p className="text-gray-400 font-semibold">Official Trailer Unavailable</p>
                  <p className="text-xs text-gray-500">We couldn&apos;t load the YouTube stream for this title.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
