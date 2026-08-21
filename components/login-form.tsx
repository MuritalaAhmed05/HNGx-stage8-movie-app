"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { auth } from "@/app/firebase";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    return email.trim() !== "" && /\S+@\S+\.\S+/.test(email) && password.length >= 6;
  };

  const translateFirebaseError = (errorCode: string) => {
    const errorMap: Record<string, string> = {
      "auth/user-not-found": "User not found. Please check your email.",
      "auth/wrong-password": "Incorrect password. Please try again.",
      "auth/invalid-email": "Invalid email format.",
      "auth/invalid-credential": "Invalid credentials. Please check your details.",
      "auth/network-request-failed": "Network error. Please try again later.",
      "auth/too-many-requests": "Too many attempts. Try again later.",
    };
    return errorMap[errorCode] || `Error: ${errorCode}`;
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back! Signed in successfully.");
      router.push("/");
    } catch (err: any) {
      toast.error(translateFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleProviderLogin = async (provider: GoogleAuthProvider | GithubAuthProvider) => {
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      toast.success("Signed in successfully!");
      router.push("/");
    } catch (err: any) {
      toast.error(translateFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="p-8 rounded-2xl glass-card border border-white/15 text-white max-w-md w-full mx-auto shadow-2xl"
    >
      <form onSubmit={handleLogin} className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-black text-gradient">Welcome Back</h1>
          <p className="text-xs text-gray-400">
            Sign in to access your custom watchlist and recommendations.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-gray-300">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-slate-950 border-white/20 text-white text-xs placeholder:text-gray-500 focus:border-red-500"
            />
          </div>

          <div className="grid gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-semibold text-gray-300">
                Password
              </Label>
              <Link
                href="/reset-password"
                className="text-[11px] text-red-400 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-slate-950 border-white/20 text-white text-xs focus:border-red-500"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl py-2.5 shadow-lg shadow-red-600/30 transition-all mt-2"
            disabled={!validateForm() || loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="relative text-center text-xs my-2 after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-white/10">
            <span className="relative z-10 bg-slate-900 px-3 text-gray-400">
              Or continue with
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full glass-button text-xs font-semibold text-gray-200 hover:text-white"
            onClick={() => handleProviderLogin(new GoogleAuthProvider())}
          >
            Google Sign In
          </Button>

          <p className="text-center text-xs text-gray-400 mt-2">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-red-400 font-bold hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </form>
    </motion.div>
  );
}