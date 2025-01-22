import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      title: "You don't need to know Python to explore your data.",
      upload: "Upload dataset",
      generate: "Generate pandas command",
      clear: "Clear Table",
      rowsPerPage: "Rows per page",
      noDataset: "No dataset provided.",
      noDatasetDescription: "Please upload a CSV file.",
      noPrompt: "No prompt provided.",
      noPromptDescription: "Please write a prompt.",
      error: "Error",
      unexpectedError: "An unexpected error occurred.",
      invalidFileType: "Invalid file type. Only CSV files are allowed.",
      paginationPrevious: "Previous",
      paginationNext: "Next",
      rows: "Rows",
      all: "All",
      next: "Next",
      previous: "Previous",
      textareaPlaceholder: "Describe how you want to manipulate your data...",

      toast: {
        noPromptTitle: "Please write a prompt.",
        noPromptDesc: "Please write a prompt.",
        noDatasetTitle: "Please upload a CSV file.",
        noDatasetDesc: "Please upload a CSV file.",
      },
    },
  },
  pt: {
    translation: {
      title: "Você não precisa saber Python para explorar seus dados.",
      upload: "Enviar conjunto de dados",
      generate: "Gerar comando pandas",
      clear: "Limpar Tabela",
      rowsPerPage: "Linhas por página",
      noDataset: "Nenhum conjunto de dados fornecido.",
      noDatasetDescription: "Por favor, envie um arquivo CSV.",
      noPrompt: "Nenhuma instrução fornecida.",
      noPromptDescription: "Por favor, escreva uma instrução.",
      error: "Erro",
      unexpectedError: "Ocorreu um erro inesperado.",
      invalidFileType:
        "Tipo de arquivo inválido. Apenas arquivos CSV são permitidos.",
      paginationPrevious: "Anterior",
      paginationNext: "Próximo",
      rows: "Linhas",
      all: "Todas",
      next: "Próximo",
      previous: "Anterior",
      textareaPlaceholder: "Descreva como deseja manipular seus dados...",
    },

    toast: {
      noPromptTitle: "Por favor, escreva uma instrução.",
      noPromptDesc: "Por favor, escreva uma instrução.",
      noDatasetTitle: "Por favor, envie um arquivo CSV.",
      noDatasetDesc: "Por favor, envie um arquivo CSV.",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
