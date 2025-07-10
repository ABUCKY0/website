// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react'
import remarkCallout from "@r4ai/remark-callout";
import tailwind from '@astrojs/tailwind';
// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
  ],
  markdown: {
    // ...
    remarkPlugins: [
      // ...
      remarkCallout,
    ],
  },
  devToolbar: {
    enabled: false
  },
  site: 'https://abucky.dev'
});
