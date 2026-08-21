"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithGoogle } from "@/app/service/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/app/firebase";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import Link from "next/link";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const schema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be under 20 characters")
      .regex(/^[a-zA-Z0-9]+$/, "Username must not contain spaces"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain uppercase letter")
      .regex(/[a-z]/, "Must contain lowercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function RegisterForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const handleRegister = async (data: any) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: data.username });
      await setDoc(doc(db, "users", user.uid), {
        username: data.username,
        email: data.email,
        createdAt: new Date(),
      });

      await sendEmailVerification(user);
      toast.success("Registration successful! Email verification sent.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message || "Registration failed. Try again.");
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
      <form onSubmit={handleSubmit(handleRegister)} className={cn("flex flex-col gap-5", className)} {...props}>
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-black text-gradient">Create Account</h1>
          <p className="text-xs text-gray-400">
            Join Filmzy to personalize your movie recommendations and watchlist.
          </p>
        </div>

        <div className="grid gap-3">
          <div>
            <Label htmlFor="username" className="text-xs font-semibold text-gray-300">
              Username
            </Label>
            <Input
              id="username"
              placeholder="alex123"
              {...register("username")}
              className="bg-slate-950 border-white/20 text-white text-xs placeholder:text-gray-500 focus:border-red-500 mt-1"
            />
            {errors.username && (
              <p className="text-red-400 text-[11px] mt-1">{errors.username.message as string}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-xs font-semibold text-gray-300">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className="bg-slate-950 border-white/20 text-white text-xs placeholder:text-gray-500 focus:border-red-500 mt-1"
            />
            {errors.email && (
              <p className="text-red-400 text-[11px] mt-1">{errors.email.message as string}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="text-xs font-semibold text-gray-300">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              className="bg-slate-950 border-white/20 text-white text-xs focus:border-red-500 mt-1"
            />
            {errors.password && (
              <p className="text-red-400 text-[11px] mt-1">{errors.password.message as string}</p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-xs font-semibold text-gray-300">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              className="bg-slate-950 border-white/20 text-white text-xs focus:border-red-500 mt-1"
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-[11px] mt-1">{errors.confirmPassword.message as string}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl py-2.5 shadow-lg shadow-red-600/30 transition-all mt-3"
            disabled={loading || !isValid}
          >
            {loading ? "Creating Account..." : "Register Account"}
          </Button>

          <p className="text-center text-xs text-gray-400 mt-3">
            Already registered?{" "}
            <Link href="/login" className="text-red-400 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </motion.div>
  );
}