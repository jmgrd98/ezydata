'use client'
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

const LandingNavbar = () => {
  const { t } = useTranslation();
  const { isSignedIn } = useAuth();

  return (
    <nav className="p-4 bg-transparent flex items-center justify-between">
      <Link href={'/'} className="flex items-center">
        <h1 className={cn('comfortaa text-3xl, font-bold text-white')}>Ezydata</h1>
      </Link>
      <div className="flex items-center gap-x-2">
        <Link href={isSignedIn ? '/dashboard' : '/sign-up'}>
        <Button variant={'outline'} className="rounded-full text-black">
          {t('landing.landingHero.generateButton')}
        </Button>
        </Link>
      </div>
    </nav>
  )
}

export default LandingNavbar