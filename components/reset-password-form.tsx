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
import { Mail, KeyRound, ArrowLeft } from "lucide-react";

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <form onSubmit={handleSubmit(handleResetPassword)} className={cn("space-y-5", className)} {...props}>
        <div className="text-center space-y-1.5 mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Reset Password 🔑
          </h1>
          <p className="text-xs text-gray-400">
            Enter your account email below to receive recovery instructions.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
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

          <Button
            type="submit"
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2 mt-2"
            disabled={loading || !isValid}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending Link...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Send Reset Link <KeyRound size={16} />
              </span>
            )}
          </Button>

          <p className="text-center text-xs text-gray-400 mt-4 pt-2 border-t border-white/5">
            Remembered your password?{" "}
            <Link href="/login" className="text-red-400 font-bold hover:text-red-300 hover:underline">
              <ArrowLeft size={12} className="inline mr-0.5" /> Return to Sign In
            </Link>
          </p>
        </div>
      </form>
    </motion.div>
  );
}