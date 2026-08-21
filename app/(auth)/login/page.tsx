import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/login-form"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 overflow-hidden">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2.5 font-bold">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/10 bg-slate-900">
              <Image
                src="/logo.png"
                width={32}
                height={32}
                alt="Filmzy Logo"
                className="object-contain p-0.5"
              />
            </div>
            <span className="text-xl font-extrabold text-white">
              Film<span className="text-red-500">zy</span>
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block bg-black">
        <img
          src="/login.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
