// NAVBAR COMPONENT (updated to accept children)
'use client'

import { UserButton } from '@clerk/nextjs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import Flag from 'react-world-flags'
import i18n from "@/translation"
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'

const Navbar = ({ children }: { children?: React.ReactNode }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <header className="w-full flex items-center justify-between p-3 border-b bg-background">
      <div className="flex items-center">
        {children}
      </div>

      <p className="comfortaa text-3xl font-bold align-self-start cursor-pointer" onClick={() => router.push('/dashboard')}>EZYDATA</p>
      
      <div className='flex items-center gap-5'>
        <Select
          onValueChange={(value) => changeLanguage(value)}
          defaultValue={i18n.language}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={t('language')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">
              <span className="flex items-center gap-2">
                <Flag code="US" style={{ width: 20, height: 15 }} />
                <span>{t('English')}</span>
              </span>
            </SelectItem>
            <SelectItem value="pt">
              <span className="flex items-center gap-2">
                <Flag code="BR" style={{ width: 20, height: 15 }} />
                <span>{t('Português')}</span>
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
        <UserButton afterSignOutUrl='/' />
      </div>
    </header>
  )
}

export default Navbar