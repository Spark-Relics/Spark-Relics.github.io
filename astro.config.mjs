// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://spark-relics.github.io',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh', 'zh-tw', 'ja', 'ko', 'es', 'fr', 'de'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()]
  }
});