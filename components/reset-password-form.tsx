"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/app/firebase";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

export function ResetPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const handleResetPassword = async (data: any) => {
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, data.email);
      toast.success("If registered, a password reset link has been dispatched.");
      reset();
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Something went wrong. Please try again later.");
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
      <form onSubmit={handleSubmit(handleResetPassword)} className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-black text-gradient">Reset Password</h1>
          <p className="text-xs text-gray-400">
            Enter your account email below to receive password recovery instructions.
          </p>
        </div>

        <div className="grid gap-4">
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

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl py-2.5 shadow-lg shadow-red-600/30 transition-all mt-2"
            disabled={loading || !isValid}
          >
            {loading ? "Sending Link..." : "Send Reset Link"}
          </Button>

          <p className="text-center text-xs text-gray-400 mt-2">
            Remembered your password?{" "}
            <Link href="/login" className="text-red-400 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </motion.div>
  );
}