import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync } from 'node:fs';

/**
 * A package plus everything it depends on, read from node_modules. Bundling a
 * CommonJS package's whole tree leaves no runtime require() in the SSR output,
 * so Netlify's function file tracing has nothing to miss.
 */
function withDependencies(name, seen = new Set()) {
  if (seen.has(name)) return seen;
  seen.add(name);
  const pkg = JSON.parse(readFileSync(new URL(`./node_modules/${name}/package.json`, import.meta.url), 'utf8'));
  for (const dependency of Object.keys(pkg.dependencies ?? {})) {
    withDependencies(dependency, seen);
  }
  return seen;
}

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
      // sanitize-html is CommonJS but requires the ESM-only htmlparser2 12,
      // which crashes the Netlify function (no require(esm)). Bundling its
      // whole tree converts it to ESM; bundling only sanitize-html left its
      // other dependencies as runtime requires that weren't traced.
      noExternal: ['react-tweet', ...withDependencies('sanitize-html')],
    },
  },
});
