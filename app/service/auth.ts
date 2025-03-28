import {
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    GoogleAuthProvider,
    GithubAuthProvider,
    UserCredential,
  } from "firebase/auth";
  import { auth } from "../firebase";
  
  // Providers
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();
  
  /**
   * Sign in with Google
   */
  export const signInWithGoogle = async (): Promise<UserCredential | null> => {
    try {
      return await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Error signing in with Google:", error.message || error);
      return null;
    }
  };
  
  /**
   * Sign in with GitHub
   */
  export const signInWithGitHub = async (): Promise<UserCredential | null> => {
    try {
      return await signInWithPopup(auth, githubProvider);
    } catch (error: any) {
      console.error("Error signing in with GitHub:", error.message || error);
      return null;
    }
  };
  
  /**
   * Sign up with Email & Password and set Username
   */
  export const signUpWithEmail = async (username: string, email: string, password: string): Promise<UserCredential | null> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: username });
      }
  
      return userCredential;
    } catch (error: any) {
      console.error("Error signing up:", error.message || error);
      return null;
    }
  };
  
  /**
   * Sign in with Email & Password
   */
  export const signInWithEmail = async (email: string, password: string): Promise<UserCredential | null> => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error("Error signing in with email:", error.message || error);
      return null;
    }
  };
  
  /**
   * Logout
   */
  export const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error("Error signing out:", error.message || error);
    }
  };
  