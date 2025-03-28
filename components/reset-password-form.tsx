"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/app/firebase";
import { toast } from "sonner";

export function ResetPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("If this email is registered, you'll receive a reset link.");
      setEmail("");
    } catch {
      toast.success("If this email is registered, you'll receive a reset link."); 
      // No need to show error since we want to keep it generic
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleResetPassword} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below, and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading || !email.trim()}>
          {loading ? "Sending..." : "Reset Password"}
        </Button>
      </div>

      <div className="text-center text-sm">
        Remember your password?{" "}
        <a href="/login" className="underline underline-offset-4 text-black">
          Login
        </a>
      </div>
    </form>
  );
}
