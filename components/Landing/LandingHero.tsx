'use client';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import TypewriterComponent from 'typewriter-effect';
import { Button } from '../ui/button';
import { useTranslation } from 'react-i18next';

const LandingHero = () => {
  
  const { isSignedIn, isLoaded } = useAuth();
  const { t } = useTranslation();
  
  if (!isLoaded) {
    return null;
  }

  return (
    <div className='inter flex flex-col gap-5 text-white font-bold py-10 pb-40 text-center space-y-5 my-5 mt-20'>
      <div className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold'>
        <h1>{t('landing.landingHero.title')}</h1>
        <div className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'>
          <TypewriterComponent
            options={{
              strings: [
                t('landing.landingHero.typewriterStrings.python'),
                t('landing.landingHero.typewriterStrings.pandas'),
                t('landing.landingHero.typewriterStrings.numpy'),
                t('landing.landingHero.typewriterStrings.matplotlib'),
                t('landing.landingHero.typewriterStrings.howToCode'),
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
        <h1>{t('landing.landingHero.subtitle')}</h1>
      </div>

      <div className='text-sm md:text-xl font-light text-zinc-400'>
        {t('landing.landingHero.description')}
      </div>

      <div>
        <Link href={isSignedIn ? '/dashboard' : '/sign-up'}>
          <Button variant={'premium'}  size={'xl'} className='md:text-lg p-4 py-8 md:p-6 rounded-full font-semibold'>
            {t('landing.landingHero.generateButton')}
          </Button>
        </Link>
      </div>

      <div className='text-zinc-400 text-sm md:text-[16px] font-normal'>
        {t('landing.landingHero.noCreditCard')}
      </div>
    </div>
  );
};

export default LandingHero;
