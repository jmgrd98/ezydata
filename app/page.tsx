'use client'

import LandingHero from "@/components/Landing/LandingHero"
import LandingNavbar from "@/components/Landing/LandingNavbar"
import i18n from "@/translation";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LandingContent from "@/components/Landing/LandingContent";

const LandingPage = () => {

    const { isSignedIn } = useAuth();
    const router = useRouter();
  
    useEffect(() => {
      detectLanguage();
    }, []);

    useEffect(() => {
      if (isSignedIn) {
        router.push('/dashboard');
      }
    }, [isSignedIn, router]);

  const detectLanguage = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      const countryCode = data.country_code;
      const languageMap: Record<string, string> = {
        US: "en",
        BR: "pt",
        // Add more mappings as needed
      };
  
      const language = languageMap[countryCode] || "en";
      i18n.changeLanguage(language);
    } catch (error) {
      console.error("Error detecting location:", error);
    }
  };

  return (
    <div className='h-full bg-black text-white'>
      <LandingNavbar />
      <LandingHero />
      <LandingContent />
    </div>
  )
}

export default LandingPage