import { Suspense } from "react";
import FavoritesPage from "./favourite";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading favorites...</p>}>
      <FavoritesPage />
    </Suspense>
  );
}
