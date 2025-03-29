"use client";

import FavoritesPage from "./favourite";
import { Suspense } from "react";

export default function FavouritePage() {
  return (
    <Suspense fallback={<p>Loading favourites...</p>}>
      <FavoritesPage />
    </Suspense>
  );
}
