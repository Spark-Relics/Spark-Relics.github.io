// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

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
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          zh: 'zh-CN',
          'zh-tw': 'zh-TW',
          ja: 'ja-JP',
          ko: 'ko-KR',
          es: 'es-ES',
          fr: 'fr-FR',
          de: 'de-DE',
        },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});