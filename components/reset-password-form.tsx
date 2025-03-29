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
      toast.success("If this email is registered, you'll receive a reset link.");
      reset(); 
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 rounded-lg shadow-lg bg-gradient-to-br from-blue-50 to-white border border-blue-100"
    >
      <form onSubmit={handleSubmit(handleResetPassword)} className={cn("flex flex-col gap-6", className)} {...props}>
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold text-blue-700">Reset Password</h1>
          <p className="text-sm text-blue-600">
            Enter your email below, and we&apos;ll send you a link to reset your password.
          </p>
        </motion.div>

        <div className="grid gap-4">
          <motion.div variants={itemVariants} className="grid gap-2">
            <Label htmlFor="email" className="text-blue-700">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register("email")}
              className="border-blue-200 focus:border-blue-400 focus:ring-blue-300 transition-all duration-300"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message as string}</p>}
          </motion.div>
          
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: isValid && !loading ? 1.02 : 1 }}
            whileTap={{ scale: isValid && !loading ? 0.98 : 1 }}
          >
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300" 
              disabled={loading || !isValid}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </div>
              ) : "Reset Password"}
            </Button>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="text-center text-sm text-blue-600">
          Remember your password?{" "}
          <Link href="/login" className="text-blue-700 font-medium underline underline-offset-4 hover:text-blue-900 transition-colors duration-200">
            Sign in
          </Link>
        </motion.div>
      </form>
    </motion.div>
  );
}