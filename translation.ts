import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      title: "You don't need to know Python to explore your data.",
      upload: "Upload dataset",
      generate: "Generate pandas command",
      clear: "Clear Table",
      rowsPerPage: "Rows per page",
    },
  },
  pt: {
    translation: {
      title: "Você não precisa saber Python para explorar seus dados.",
      upload: "Enviar conjunto de dados",
      generate: "Gerar comando pandas",
      clear: "Limpar Tabela",
      rowsPerPage: "Linhas por página",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
