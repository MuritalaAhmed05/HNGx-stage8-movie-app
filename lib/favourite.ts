import { db } from "@/app/firebase";
import { doc, setDoc, deleteDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { Movie } from "@/app/service/types"; 
export const addToFavorites = async (userId: string, movie: any) => {
    if (!userId || !movie) throw new Error("Invalid user or movie data.");
  
    try {
      const movieData = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        genre_ids: movie.genre_ids ?? [], 
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

// export const getFavorites = async (userId: string) => {
//   if (!userId) throw new Error("User ID is required");

//   try {
//     const favoritesRef = collection(db, "users", userId, "favorites");
//     const snapshot = await getDocs(favoritesRef);

//     const favoriteMovies = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     return favoriteMovies;
//   } catch (error) {
//     console.error("Error fetching favorites:", error);
//     return [];
//   }
// };
export const getFavorites = async (userId: string) => {
  if (!userId) throw new Error("User ID is required");

  try {
    const favoritesRef = collection(db, "users", userId, "favorites");
    const snapshot = await getDocs(favoritesRef);

    const favoriteMovies = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: Number(doc.id), // Convert Firestore ID to number
        title: data.title,
        poster_path: data.poster_path,
        release_date: data.release_date,
        vote_average: data.vote_average,
        genre_ids: data.genre_ids ?? [], // Ensure genre_ids exists as an array
      } as Movie;
    });

    return favoriteMovies;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
};
