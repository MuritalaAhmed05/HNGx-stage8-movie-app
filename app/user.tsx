"use client"
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { signInWithGoogle, signInWithGitHub, signInWithEmail, signUpWithEmail, logout } from "./service/auth";
import { onAuthStateChanged, User } from "firebase/auth";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
const router = useRouter();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUser({ ...currentUser, displayName: userDoc.data().username });
        } else {
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }
    });
  
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login"); // Redirect user to login page
  };


  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Movie Bookmarking App 🎬</h1>

      {user ? (
  <div className="flex flex-col items-center border p-6 rounded-lg bg-gray-800 shadow-lg">
    <h2 className="text-xl font-semibold">Welcome, {user.displayName || "User"}! 👋</h2>

    {user.photoURL && (
      <img src={user.photoURL} alt="Profile" className="w-24 h-24 rounded-full mt-3 border-2 border-white" />
    )}

    <div className="mt-4 text-left text-sm bg-gray-700 p-4 rounded">
      <p><strong>Name:</strong> {user.displayName || "N/A"}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>UID:</strong> {user.uid}</p>
      <p><strong>Email Verified:</strong> {user.emailVerified ? "Yes ✅" : "No ❌"}</p>
      <p><strong>Provider:</strong> {user.providerData.map((p) => p.providerId).join(", ")}</p>
      <p><strong>Created At:</strong> {new Date(user.metadata.creationTime || "").toLocaleString()}</p>
      <p><strong>Last Login:</strong> {new Date(user.metadata.lastSignInTime || "").toLocaleString()}</p>
    </div>

    <button onClick={handleLogout} className="mt-4 bg-red-500 px-4 py-2 rounded">Logout</button>
  </div>
) : (
        <div className="flex flex-col gap-4">
          <button onClick={signInWithGoogle} className="bg-blue-500 px-4 py-2 rounded">Sign in with Google</button>
          <button onClick={signInWithGitHub} className="bg-gray-700 px-4 py-2 rounded">Sign in with GitHub</button>
          
          <div className="flex flex-col items-center gap-2 mt-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-2 border rounded text-black"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-3 py-2 border rounded text-black"
            />
            <button onClick={() => signInWithEmail(email, password)} className="bg-green-500 px-4 py-2 rounded">
              Sign in with Email
            </button>
            <button onClick={() => signUpWithEmail(email, password)} className="bg-purple-500 px-4 py-2 rounded">
              Sign up with Email
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
