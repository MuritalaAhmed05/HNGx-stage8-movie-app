import { db } from "@/app/firebase";
import { doc, setDoc, deleteDoc, getDoc, collection, getDocs } from "firebase/firestore";

// Add a movie to the user's favorites
export const addToFavorites = async (userId: string, movie: any) => {
    if (!userId || !movie) throw new Error("Invalid user or movie data.");
  
    try {
      const movieData = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        genre_ids: movie.genre_ids ?? [], // ✅ Ensure it's always an array
      };
  
      await setDoc(
        doc(db, "users", userId, "favorites", movie.id.toString()),
        movieData
      );
  
      console.log("Added to favorites:", movieData);
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

// Remove a movie from favorites
export const removeFromFavorites = async (userId: string, movieId: number) => {
  if (!userId) throw new Error("User ID is required");

  const movieRef = doc(db, "users", userId, "favorites", movieId.toString());

  try {
    await deleteDoc(movieRef);
    console.log(`Removed movie ID ${movieId} from favorites.`);
  } catch (error) {
    console.error("Error removing from favorites:", error);
  }
};

// Check if a movie is in favorites
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

// Fetch favorite movies for a user
export const getFavorites = async (userId: string) => {
  if (!userId) throw new Error("User ID is required");

  try {
    const favoritesRef = collection(db, "users", userId, "favorites");
    const snapshot = await getDocs(favoritesRef);

    const favoriteMovies = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return favoriteMovies;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
};
