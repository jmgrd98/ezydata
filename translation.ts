import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      title: "You don't need to know Python to explore your data.",
      upload: "Upload dataset",
      generate: "Generate",
      clear: "Clear Table",
      rowsPerPage: "Rows per page",
      noDataset: "No dataset provided.",
      noDatasetDescription: "Please upload a CSV file.",
      noPrompt: "No prompt provided.",
      noPromptDescription: "Please write a prompt.",
      unexpectedError: "An unexpected error occurred.",
      invalidFileType: "Invalid file type. Only CSV files are allowed.",
      paginationPrevious: "Previous",
      paginationNext: "Next",
      rows: "Rows",
      all: "All",
      next: "Next",
      previous: "Previous",
      textareaPlaceholder: "Describe how you want to manipulate your data...",
      expandTable: "Expand Table",
      table: "Tabela",
      chart: "Charts",
      saveProject: "Save project",
      downloadChart: "Download chart",
      login: "Entrar",

      toast: {
        noPromptTitle: "Please write a prompt.",
        noPromptDesc: "Please write a prompt.",
        noDatasetTitle: "Please upload a CSV file.",
        noDatasetDesc: "Please upload a CSV file.",
        graphSavedTitle: "Chart downloaded successfully.",
      },

      landing: {
        landingHero: {
          title: "You don't need to know",
          typewriterStrings: {
            python: "Python",
            pandas: "Pandas",
            numpy: "Numpy",
            matplotlib: "Matplotlib",
            howToCode: "how to code",
          },
          subtitle: "to manipulate your data.",
          description:
            "Visualize your dataset and generate pandas commands to manipulate it.",
          generateButton: "Start now",
          noCreditCard: "No credit card required.",
        },

        landingVideo: {
          title: "See how it works",
        },
        landingFooter: {
          developedBy: "Developed by João Marcelo Dantas",
          allRightsReserved: "Ezydata © All rights reserved.",
        },
        landingFeedback: {
          testimonials: [
            {
              quote:
                "This platform has completely transformed how we work. The efficiency gains are incredible, and the support team is always helpful. Highly recommended!",
              name: "Alex Thompson",
              role: "CTO at Tech Innovations",
              emoji: "😊",
            },
            {
              quote:
                "The best decision we've made for our workflow. It's intuitive, powerful, and constantly improving. Our productivity has doubled!",
              name: "Sarah Johnson",
              role: "Product Manager at Digital Solutions",
              emoji: "🚀",
            },
            {
              quote:
                "A game-changer in the industry. The automation features alone have saved us hundreds of hours monthly. Exceptional tool!",
              name: "Michael Chen",
              role: "CEO of Future Tech",
              emoji: "💡",
            },
            {
              quote:
                "Outstanding service and cutting-edge features. Our team collaboration has never been smoother. Worth every penny!",
              name: "Emma Wilson",
              role: "Lead Developer at Code Masters",
              emoji: "🌟",
            },
            {
              quote:
                "Revolutionized our client interactions. The analytics dashboard provides insights we never knew we needed. Absolutely brilliant!",
              name: "David Martinez",
              role: "Sales Director at Market Leaders",
              emoji: "📈",
            },
            {
              quote:
                "The perfect balance between simplicity and powerful features. Our onboarding time reduced by 70% compared to previous tools.",
              name: "Linda Smith",
              role: "Operations Manager at Swift Corp",
              emoji: "⚡",
            },
          ],
        },
      },

      deleteModal: {
        title: "Delete Project",
        description:
          'Are you sure you want to delete the project "{{name}}"? This action cannot be undone.',
        cancelButton: "Cancel",
        confirmButton: "Delete",
      },

      error: {
        jsonNotArray: "JSON data must be an array of objects",
        jsonEmpty: "JSON array is empty",
        jsonInvalidStructure:
          "Invalid JSON structure - must be array of objects",
      },
    },
  },
  pt: {
    translation: {
      title: "Você não precisa saber Python para explorar seus dados.",
      upload: "Enviar conjunto de dados",
      generate: "Gerar",
      clear: "Limpar Tabela",
      rowsPerPage: "Linhas por página",
      noDataset: "Nenhum conjunto de dados fornecido.",
      noDatasetDescription: "Por favor, envie um arquivo CSV.",
      noPrompt: "Nenhuma instrução fornecida.",
      noPromptDescription: "Por favor, escreva uma instrução.",
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
      expandTable: "Expandir Tabela",
      table: "Tabela",
      chart: "Gráficos",
      saveProject: "Salvar projeto",
      downloadChart: "Baixar gráfico",
      login: "Entrar",

      toast: {
        noPromptTitle: "Por favor, escreva uma instrução.",
        noPromptDesc: "Por favor, escreva uma instrução.",
        noDatasetTitle: "Por favor, envie um arquivo CSV.",
        noDatasetDesc: "Por favor, envie um arquivo CSV.",
        graphSavedTitle: "Gráfico baixado com sucesso.",
      },

      landing: {
        landingHero: {
          title: "Você não precisa saber",
          typewriterStrings: {
            python: "Python",
            pandas: "Pandas",
            numpy: "Numpy",
            matplotlib: "Matplotlib",
            howToCode: "código",
          },
          subtitle: "para manipular seus dados.",
          description:
            "Visualize seu conjunto de dados e gere comandos pandas para manipular.",
          generateButton: "Comece agora",
          noCreditCard: "Totalmente gratuito.",
        },
        landingVideo: {
          title: "Veja como funciona",
        },
        landingFooter: {
          developedBy: "Desenvolvido por João Marcelo Dantas",
          allRightsReserved: "Ezydata © Todos os direitos reservados.",
        },
        landingFeedback: {
          testimonials: [
            {
              quote:
                "Esta plataforma transformou completamente nossa forma de trabalhar. Os ganhos de eficiência são incríveis e a equipe de suporte é sempre prestativa. Altamente recomendado!",
              name: "Alex Thompson",
              role: "CTO da Tech Innovations",
              emoji: "😊",
            },
            {
              quote:
                "A melhor decisão que tomamos para nosso fluxo de trabalho. É intuitivo, poderoso e está em constante melhoria. Nossa produtividade dobrou!",
              name: "Sarah Johnson",
              role: "Gerente de Produto na Digital Solutions",
              emoji: "🚀",
            },
            {
              quote:
                "Uma mudança de paradigma no setor. Somente os recursos de automação já nos economizaram centenas de horas por mês. Ferramenta excepcional!",
              name: "Michael Chen",
              role: "CEO da Future Tech",
              emoji: "💡",
            },
            {
              quote:
                "Serviço excepcional e recursos de ponta. Nossa colaboração em equipe nunca foi tão suave. Vale cada centavo!",
              name: "Emma Wilson",
              role: "Desenvolvedora Líder na Code Masters",
              emoji: "🌟",
            },
            {
              quote:
                "Revolucionou nossas interações com clientes. O painel de análises fornece insights que nem sabíamos que precisávamos. Absolutamente brilhante!",
              name: "David Martinez",
              role: "Diretor de Vendas na Market Leaders",
              emoji: "📈",
            },
            {
              quote:
                "O equilíbrio perfeito entre simplicidade e recursos poderosos. Nosso tempo de integração reduziu 70% em comparação com ferramentas anteriores.",
              name: "Linda Smith",
              role: "Gerente de Operações na Swift Corp",
              emoji: "⚡",
            },
          ],
        },
      },

      deleteModal: {
        title: "Excluir Projeto",
        description:
          'Tem certeza que deseja excluir o projeto "{{name}}"? Esta ação não pode ser desfeita.',
        cancelButton: "Cancelar",
        confirmButton: "Excluir",
      },

      error: {
        jsonNotArray: "JSON precisa ser um array de objetos",
        jsonEmpty: "JSON array vazio",
        jsonInvalidStructure:
          "Estrutura JSON inválida - precisa ser array de objetos",
      },
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
