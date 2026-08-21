import { Skeleton } from "@/components/ui/skeleton";

export default function MovieCardSkeleton() {
  return (
    <div className="relative rounded-xl overflow-hidden glass-card flex flex-col h-full border border-white/10 shadow-lg">
      {/* Heart button placeholder */}
      <div className="absolute top-3 right-3 z-20">
        <Skeleton className="h-9 w-9 rounded-full bg-slate-800/80" />
      </div>

      {/* Poster placeholder matching aspect-[2/3] */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
        <Skeleton className="w-full h-full bg-slate-800 animate-pulse" />
        {/* Rating badge placeholder */}
        <div className="absolute bottom-3 left-3">
          <Skeleton className="h-6 w-14 rounded-md bg-slate-800/80" />
        </div>
      </div>

      {/* Info Content placeholder */}
      <div className="p-4 flex flex-col justify-between flex-grow bg-slate-900/40 space-y-3">
        <div>
          {/* Release year and genre */}
          <div className="flex justify-between items-center mb-2">
            <Skeleton className="h-3 w-12 bg-slate-800" />
            <Skeleton className="h-3 w-20 bg-slate-800" />
          </div>
          {/* Title */}
          <Skeleton className="h-5 w-3/4 bg-slate-800 rounded" />
        </div>

        {/* Bottom bar divider */}
        <div className="pt-2.5 border-t border-white/5 flex justify-between items-center">
          <Skeleton className="h-4 w-12 rounded bg-slate-800" />
          <Skeleton className="h-3 w-14 bg-slate-800" />
        </div>
      </div>
    </div>
  );
}
