import { ResetPasswordForm } from "@/components/reset-password-form";
import Image from "next/image";
import Link from "next/link";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col justify-between p-4 sm:p-8 relative text-white">

      {/* Top Header Logo */}
      <header className="relative z-10 flex justify-center sm:justify-start max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-red-600/20 border border-white/10 group-hover:scale-105 transition-transform bg-slate-900">
            <Image
              src="/logo.png"
              width={36}
              height={36}
              alt="Filmzy Logo"
              className="object-contain p-1"
            />
          </div>
          <span className="text-2xl font-black tracking-tight text-gradient">
            Film<span className="text-red-500">zy</span>
          </span>
        </Link>
      </header>

      {/* Main Center Card */}
      <main className="relative z-10 flex items-center justify-center my-auto py-8">
        <div className="w-full max-w-md glass-card rounded-3xl border border-white/15 p-6 sm:p-8 shadow-2xl bg-slate-950/80 backdrop-blur-2xl">
          <ResetPasswordForm />
        </div>
      </main>

      {/* Simple Footer Notice */}
      <footer className="relative z-10 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Filmzy. All rights reserved.
      </footer>
    </div>
  );
}
