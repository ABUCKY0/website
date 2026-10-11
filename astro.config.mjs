// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';
import { unified } from '@astrojs/markdown-remark';
import remarkCallout from "@r4ai/remark-callout";
// import tailwind from '@astrojs/tailwind';
import icon from "astro-icon";
import sitemap from '@astrojs/sitemap';
// https://astro.build/config
export default defineConfig({
  fonts: [{
    provider: fontProviders.local(),
    name: "Glacial Indifference",
    cssVariable: "--font-glacial-indifference",
    options: {
      variants: [{
        src: ['./public/fonts/glacial-indifference.regular.otf'],
        weight: 'normal',
        style: 'normal'
      },
      {
        src: ['./public/fonts/GlacialIndifference-Bold.ttf'],
        weight: 'bold',
        style: 'normal'
      },
      ]
    }
  },
  {
    provider: fontProviders.local(),
    name: "Agrandir Regular",
    cssVariable: "--font-agrandir-regular",
    options: {
      variants: [{
        src: ['./public/fonts/Agrandir-Regular.otf'],
        weight: 'normal',
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
  output: 'static'
});