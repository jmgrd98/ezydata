'use client'
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

const LandingNavbar = () => {
  const { t } = useTranslation();
  const { isSignedIn } = useAuth();

  return (
    <nav className="p-4 bg-transparent flex items-center justify-between">
      <Link href={'/'} className="flex items-center">
        <h1 className={'comfortaa text-5xl, font-bold text-white'}>Ezydata</h1>
      </Link>
      <div className="flex items-center gap-x-2">
        <Link href={isSignedIn ? '/dashboard' : '/sign-up'}>
        <Button variant={'secondary'} className="rounded-full text-black">
          {t('login')}
        </Button>
        </Link>
      </div>
    </nav>
  )
}

export default LandingNavbar