import { GalleryVerticalEnd } from "lucide-react"
import { ResetPasswordForm } from "@/components/reset-password-form"
import Image from "next/image"

export default function LoginPage() {
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
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
             <Image
                                     src="/logo.png"
                                     width={24}
                                     height={24}
                                     alt="Logo"
                                     
                                     >
                     
                                   </Image>
                                 </div>
                                Flimzy
          </a>
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
