import { useAiModel } from '@/contexts/AiModelsContext';
import { UserButton } from '@clerk/nextjs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import Flag from 'react-world-flags';
import i18n from "@/translation";
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Navbar = ({ children }: { children?: React.ReactNode }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { aiModel, setAiModel } = useAiModel();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="w-full flex items-center justify-between p-3 border-b bg-background">
      <div className='flex items-center gap-5'>
        <div className="flex items-center">
          {children}
        </div>

        <p className="comfortaa text-3xl font-bold align-self-start cursor-pointer" onClick={() => router.push('/dashboard')}>
          EZYDATA
        </p>

      </div>
      
      <div className='flex items-center gap-5'>
        <Select onValueChange={(value) => setAiModel(value as 'openai' | 'gemini' | 'claude' | 'deepseek')} defaultValue={aiModel}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={aiModel} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="openai">
              <span className="flex items-center gap-2">
                <Image src="/assets/ai-icons/openai/chatgpt-icon.svg" alt="OpenAI" width={20} height={15} />
                <span>OpenAI</span>
              </span>
            </SelectItem>
            <SelectItem value="gemini">
              <span className="flex items-center gap-2">
                <Image src="/assets/ai-icons/gemini/gemini-color.svg" alt="OpenAI" width={20} height={15} />
                <span>Gemini</span>
              </span>
            </SelectItem>
            <SelectItem value="claude">
              <span className="flex items-center gap-2">
                <Image src="/assets/ai-icons/claude/claude-ai-icon.svg" alt="Claude" width={20} height={15} />
                <span>Claude</span>
              </span>
            </SelectItem>
            <SelectItem value="deepseek">
              <span className="flex items-center gap-2">
                <Image src="/assets/ai-icons/deepseek/deepseek-color.svg" alt="DeepSeek" width={20} height={15} />
                <span>DeepSeek</span>
              </span>
            </SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => changeLanguage(value)} defaultValue={i18n.language}>
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
  );
};

export default Navbar;
