'use client'
import { Montserrat } from "next/font/google";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

const font = Montserrat({
    weight: "600",
    subsets: ['latin']
})

const LandingNavbar = () => {

  const { isSignedIn } = useAuth();

  return (
    <nav className="p-4 bg-transparent flex items-center justify-between">
      <Link href={'/'} className="flex items-center">
        <h1 className={cn('text-3xl, font-bold text-white', font.className)}>Ezydata</h1>
      </Link>
      <div className="flex items-center gap-x-2">
        <Link href={isSignedIn ? '/dashboard' : '/sign-up'}>
            <Button variant={'outline'} className="rounded-full text-black">
                Get Started
            </Button>
        </Link>
      </div>
    </nav>
  )
}

export default LandingNavbar