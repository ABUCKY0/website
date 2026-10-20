// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import { unified } from '@astrojs/markdown-remark';
import remarkCallout from "@r4ai/remark-callout";
// import tailwind from '@astrojs/tailwind';
import icon from "astro-icon";
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Open Sauce Sans",
      cssVariable: "--font-open-sauce-sans",
      options: {
        variants: [{
          src: ['./public/fonts/OpenSauceSans-Bold.ttf'],
          weight: 'bold',
          style: 'normal'
        }]
      }
    },
    {
      provider: fontProviders.local(),
      name: "Archivo Black",
      cssVariable: "--font-archivo-black",
      options: {
        variants: [{
          src: ['./public/fonts/ArchivoBlack-Regular.ttf'],
          weight: '900',
          style: 'normal'
        }]
      }
    },
    {
      provider: fontProviders.local(),
      name: "Open Sans",
      cssVariable: "--font-open-sans",
      options: {
        variants: [{
          src: ['./public/fonts/OpenSans-VariableFont_wdth,wght.ttf'],
          weight: '300 800',
          style: 'normal'
        }]
      }
    }
  ],

  integrations: [react(), icon(),
    //   sitemap({
    //   filter: (page) => page !== 'https://abucky.dev/test/',
    // }),
  ],

  markdown: {
    shikiConfig: {
      theme: 'dark-plus', // or any Shiki theme name
    },
    processor: unified({
      remarkPlugins: [remarkCallout],
    }),
  },

  // devToolbar: {
  //   enabled: false
  // },
  site: 'https://abucky.dev',
  // output: 'server',
  // adapter: cloudflare()
});