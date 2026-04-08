import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://nickbell.dev',
  output: 'server',
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
