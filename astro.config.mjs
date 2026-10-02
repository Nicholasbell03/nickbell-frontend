import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://nickbell.dev',
  output: 'server',
  // Astro 7 defaults to JSX whitespace rules ('jsx'), which drops spaces between
  // inline elements. Keep the v6 HTML-aware behaviour so rendering is unchanged.
  compressHTML: true,
  adapter: netlify(),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': '/src',
      },
      // react-tweet ships CSS modules that must be bundled by Vite rather
      // than externalized for native Node ESM at SSR time.
      noExternal: ['react-tweet'],
    },
  },
});
