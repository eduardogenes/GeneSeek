// postcss.config.mjs

const config = {
  plugins: {
    // 1. Primeiro, processa o Tailwind CSS.
    '@tailwindcss/postcss': {},
    // 2. Depois, adiciona os prefixos de fornecedor para compatibilidade.
    autoprefixer: {},
  },
};

export default config;