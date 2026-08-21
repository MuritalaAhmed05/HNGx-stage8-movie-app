import { db } from "@/app/firebase";
import { doc, setDoc, deleteDoc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { Movie } from "@/app/service/types";

export type WatchStatus = "plan" | "watching" | "completed";

export interface FavoriteMovie extends Movie {
  status?: WatchStatus;
}

export const addToFavorites = async (userId: string, movie: any, status: WatchStatus = "plan") => {
  if (!userId || !movie) throw new Error("Invalid user or movie data.");

  try {
    const movieData = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date || "",
      vote_average: movie.vote_average || 0,
      genre_ids: movie.genre_ids ?? [],
      status: status,
    };

    await setDoc(
      doc(db, "users", userId, "favorites", movie.id.toString()),
      movieData,
      { merge: true }
    );
  } catch (error) {
    console.error("Error adding to favorites:", error);
  }
};

export const updateWatchStatus = async (userId: string, movieId: number, status: WatchStatus) => {
  if (!userId) return;
  try {
    const movieRef = doc(db, "users", userId, "favorites", movieId.toString());
    await updateDoc(movieRef, { status });
  } catch (error) {
    console.error("Error updating watch status:", error);
  }
};

export const removeFromFavorites = async (userId: string, movieId: number) => {
  if (!userId) throw new Error("User ID is required");
  const movieRef = doc(db, "users", userId, "favorites", movieId.toString());

  try {
    await deleteDoc(movieRef);
  } catch (error) {
    console.error("Error removing from favorites:", error);
  }
};

export const isFavorite = async (userId: string, movieId: number) => {
  if (!userId) return false;
  const movieRef = doc(db, "users", userId, "favorites", movieId.toString());

  try {
    const docSnap = await getDoc(movieRef);
    return docSnap.exists();
  } catch (error) {
    console.error("Error checking favorites:", error);
    return false;
  }
};

export const getFavorites = async (userId: string): Promise<FavoriteMovie[]> => {
  if (!userId) throw new Error("User ID is required");

  try {
    const favoritesRef = collection(db, "users", userId, "favorites");
    const snapshot = await getDocs(favoritesRef);

    const favoriteMovies = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: Number(doc.id),
        title: data.title,
        poster_path: data.poster_path,
        release_date: data.release_date,
        vote_average: data.vote_average,
        genre_ids: data.genre_ids ?? [],
        status: (data.status as WatchStatus) || "plan",
      } as FavoriteMovie;
    });

    return favoriteMovies;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
};
