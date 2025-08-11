// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react'
import remarkCallout from "@r4ai/remark-callout";
import tailwind from '@astrojs/tailwind';
import icon from "astro-icon";
// https://astro.build/config
export default defineConfig({
  integrations: [react(), icon()],
  markdown: {
    shikiConfig: {
      theme: 'dark-plus', // or any Shiki theme name
    },
    remarkPlugins: [
      // ...
      remarkCallout,
    ],
  },
  // devToolbar: {
  //   enabled: false
  // },
  site: 'https://abucky.dev'
});