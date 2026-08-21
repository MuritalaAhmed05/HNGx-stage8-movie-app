import { ResetPasswordForm } from "@/components/reset-password-form"
import Image from "next/image"
import Link from "next/link"

export default function ResetPasswordPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2 fixed inset-0">
      {/* Image Section (Fixed) */}
      <div className="relative hidden bg-black lg:block">
        <img
          src="/reset.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>

      {/* Form Section (Scrollable) */}
      <div className="flex flex-col gap-4 p-6 md:p-10 overflow-y-auto">
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
            <ResetPasswordForm />
          </div>
        </div>
      </div>
    </div>
  )
}
