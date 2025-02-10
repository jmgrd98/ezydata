import React from 'react'
import { useTranslation } from 'react-i18next'

const LandingFooter = () => {
  const { t } = useTranslation();
  return (
    <div className='bg-black min-h-[100px] flex flex-col gap-3 py-5 items-center justify-center'>
      <p className='text-white'>{t('landing.landingFooter.allRightsReserved')}</p>
      <a href='https://github.com/jmgrd98' target='_blank' className='text-white hover:text-blue-500'>{t('landing.landingFooter.developedBy')}</a>
    </div>
  )
}

export default LandingFooter