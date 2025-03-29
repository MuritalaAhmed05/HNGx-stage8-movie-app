"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth"
import { auth } from "@/app/firebase"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { toast } from "sonner"
import { motion } from "framer-motion"

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    return (
      email.trim() !== "" &&
      /\S+@\S+\.\S+/.test(email) &&
      password.length >= 6
    )
  }
  
  const translateFirebaseError = (errorCode: string) => {
    const errorMap: Record<string, string> = {
      "auth/user-not-found": "User not found. Please check your email.",
      "auth/wrong-password": "Incorrect password. Please try again.",
      "auth/invalid-email": "Invalid email format. Please enter a valid email.",
      "auth/invalid-credential": "Invalid credentials. Please check your email and password.",
      "auth/network-request-failed": "Network error. Please try again later.",
      "auth/too-many-requests": "Too many failed attempts. Try again later.",
      "auth/internal-error": "Something went wrong. Please try again.",
      "auth/account-exists-with-different-credential": "This email is linked to another sign-in method.",
    };
  
    return errorMap[errorCode] || `Unexpected error: ${errorCode}`;
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      await user.reload()

      if (!user.emailVerified) {
        toast.error("Please verify your email before logging in.")
        return
      }

      toast.success("Login successful!")
      router.push("/")
    } catch (err: any) {
      toast.error(translateFirebaseError(err.code))
    } finally {
      setLoading(false)
    }
  }

  const handleProviderLogin = async (provider: GoogleAuthProvider | GithubAuthProvider) => {
    setLoading(true)

    try {
      const result = await signInWithPopup(auth, provider)
      toast.success("Login successful!")
      router.push("/")
    } catch (err: any) {
      toast.error(translateFirebaseError(err.code))
    } finally {
      setLoading(false)
    }
  }

  // Animation variants
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
      <form onSubmit={handleLogin} className={cn("flex flex-col gap-6", className)} {...props}>
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold text-blue-700">Login to your account</h1>
          <p className="text-sm text-blue-600">
            Enter your email below to log in to your account.
          </p>
        </motion.div>
        <div className="grid gap-6">
          <motion.div variants={itemVariants} className="grid gap-2">
            <Label htmlFor="email" className="text-blue-700">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-blue-200 focus:border-blue-400 focus:ring-blue-300 transition-all duration-300"
            />
          </motion.div>
          <motion.div variants={itemVariants} className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password" className="text-blue-700">Password</Label>
              <Link
                href="/reset-password"
                className="ml-auto text-sm text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline transition-colors duration-200"
              >
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-blue-200 focus:border-blue-400 focus:ring-blue-300 transition-all duration-300"
            />
          </motion.div>
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: validateForm() && !loading ? 1.02 : 1 }}
            whileTap={{ scale: validateForm() && !loading ? 0.98 : 1 }}
          >
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300" 
              disabled={!validateForm() || loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </div>
              ) : "Login"}
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-blue-200">
            <span className="relative z-10 bg-background px-2 text-blue-500">
              Or continue with
            </span>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Button
              variant="outline"
              className="w-full border-blue-200 hover:bg-blue-50 transition-all duration-200"
              onClick={() => handleProviderLogin(new GoogleAuthProvider())}
            >
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48" className="mr-2">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
              </svg>
              Login with Google
            </Button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Button
              variant="outline"
              className="w-full border-blue-200 hover:bg-blue-50 transition-all duration-200"
              onClick={() => handleProviderLogin(new GithubAuthProvider())}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className="mr-2">
                <path
                  d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                  fill="currentColor"
                />
              </svg>
              Login with GitHub
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center text-sm text-blue-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-700 font-medium underline underline-offset-4 hover:text-blue-900 transition-colors duration-200">
              Sign up
            </Link>
          </motion.div>
        </div>
      </form>
    </motion.div>
  )
}