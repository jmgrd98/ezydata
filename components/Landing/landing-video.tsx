import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import i18n from "@/translation";
import { Button } from '../ui/button';
import Link from 'next/link';
import { useAuth } from '@clerk/clerk-react';

const LandingVideo = () => {
  const { isSignedIn } = useAuth();
  const { t } = useTranslation();
  const [country, setCountry] = React.useState<string>('');
  useEffect(() => {
    detectLanguage();
  }, []);

  const detectLanguage = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      const countryCode = data.country_code;
      setCountry(countryCode);
      const languageMap: Record<string, string> = {
        US: "en",
        BR: "pt",
      };
  
      const language = languageMap[countryCode] || "en";
      i18n.changeLanguage(language);
    } catch (error) {
      console.error("Error detecting location:", error);
    }
  };
  return (
    <div className='p-5 w-full h-full bg-black text-white montserrat text-center flex flex-col items-center'>
      <p className='text-4xl'>
        {t('landing.landingVideo.title')}
      </p>
      {country === 'US' ? <video 
        src="/assets/video-ingles.mp4"
        width={'70%'} 
        height={'70%'} 
        autoPlay 
        muted 
        controls
        playsInline
        className='m-10'
      /> : <video 
        src="/assets/video-portugues.mp4"
        width={'70%'} 
        height={'70%'} 
        autoPlay 
        muted 
        controls
        playsInline
        className='m-10'
      />}

      <Link href={isSignedIn ? '/dashboard' : '/sign-up'}>
        <Button variant={'secondary'} size={'xl'} className='md:text-lg p-4 py-8 md:p-6 rounded-full font-semibold'>
          {t('landing.landingHero.generateButton')}
        </Button>
      </Link>
    </div>
  )
}

export default LandingVideo