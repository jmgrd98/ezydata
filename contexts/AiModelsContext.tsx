'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type AiModel = 'openai' | 'gemini' | 'claude' | 'deepseek';

interface AiModelContextType {
  aiModel: AiModel;
  setAiModel: (model: AiModel) => void;
}

const AiModelContext = createContext<AiModelContextType | undefined>(undefined);

export const AiModelProvider = ({ children }: { children: ReactNode }) => {
  const [aiModel, setAiModel] = useState<AiModel>('openai');

  return (
    <AiModelContext.Provider value={{ aiModel, setAiModel }}>
      {children}
    </AiModelContext.Provider>
  );
};

export const useAiModel = () => {
  const context = useContext(AiModelContext);
  if (!context) {
    throw new Error('useAiModel must be used within an AiModelProvider');
  }
  return context;
};
