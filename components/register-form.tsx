"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { User, Mail, Lock, Eye, EyeOff, UserPlus, ArrowRight } from "lucide-react";

const schema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be under 20 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain spaces"),
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <form onSubmit={handleSubmit(handleRegister)} className={cn("space-y-4", className)} {...props}>
        <div className="text-center space-y-1.5 mb-5">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Create Account 🚀
          </h1>
          <p className="text-xs text-gray-400">
            Join Filmzy to personalize your movie recommendations and watchlist.
          </p>
        </div>

        <div className="space-y-3.5">
          {/* Username */}
          <div className="space-y-1">
            <Label htmlFor="username" className="text-xs font-bold text-gray-300">
              Username
            </Label>
            <div className="relative">
              <Input
                id="username"
                placeholder="alex123"
                {...register("username")}
                className="pl-10 py-3 bg-slate-900/90 border-white/15 text-white text-xs placeholder:text-gray-500 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            {errors.username && (
              <p className="text-red-400 text-[11px] font-semibold pt-0.5">{errors.username.message as string}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs font-bold text-gray-300">
              Email Address
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                className="pl-10 py-3 bg-slate-900/90 border-white/15 text-white text-xs placeholder:text-gray-500 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            {errors.email && (
              <p className="text-red-400 text-[11px] font-semibold pt-0.5">{errors.email.message as string}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <Label htmlFor="password" className="text-xs font-bold text-gray-300">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className="pl-10 pr-10 py-3 bg-slate-900/90 border-white/15 text-white text-xs focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                aria-label="Toggle Password Visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-[11px] font-semibold pt-0.5">{errors.password.message as string}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <Label htmlFor="confirmPassword" className="text-xs font-bold text-gray-300">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("confirmPassword")}
                className="pl-10 pr-10 py-3 bg-slate-900/90 border-white/15 text-white text-xs focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                aria-label="Toggle Confirm Password Visibility"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-[11px] font-semibold pt-0.5">{errors.confirmPassword.message as string}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2 mt-3"
            disabled={loading || !isValid}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating Account...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Register Account <UserPlus size={16} />
              </span>
            )}
          </Button>

          {/* Switch to Login Link */}
          <p className="text-center text-xs text-gray-400 mt-4 pt-2 border-t border-white/5">
            Already registered?{" "}
            <Link href="/login" className="text-red-400 font-bold hover:text-red-300 hover:underline">
              Sign In <ArrowRight size={12} className="inline ml-0.5" />
            </Link>
          </p>
        </div>
      </form>
    </motion.div>
  );
}