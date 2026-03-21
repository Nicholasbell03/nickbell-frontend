# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev        # Start Astro dev server with HMR
yarn build      # Type-check with astro check and build for production
yarn lint       # Run ESLint
yarn preview    # Preview production build locally
```

This project uses Yarn 4 (Berry) with Plug'n'Play (see .pnp.cjs).

**Shell commands:** Do not prefix commands with `cd` into the project directory — it is already the working directory. Run commands directly (e.g. `git status`, `yarn build`).

## Architecture

This is a personal portfolio website built with Astro 6, TypeScript, and React 19 (islands only).

**Rendering:** Full SSR via `output: 'server'` with the Netlify adapter. Pages are `.astro` files in `src/pages/` using file-based routing. The shared layout is `src/layouts/Layout.astro`.

**Islands architecture:** Most pages ship zero client JavaScript. Interactive components are React "islands" in `src/components/react/` that hydrate independently using Astro's `client:load` / `client:idle` directives. Cross-island state uses Nano Stores (`nanostores/react`).

**Styling:** Tailwind CSS v4 via the `@tailwindcss/vite` plugin (configured in `astro.config.mjs`). Global styles and custom animations are in `src/index.css`.

**UI Libraries:**
- `@headlessui/react` - Accessible UI primitives
- `lucide-react` - Icon set
- `react-icons` - Additional icons (Font Awesome)

**Component Structure:** Astro components live in `src/components/`. React islands live in `src/components/react/`. Pages are in `src/pages/` with nested directories for `blog/`, `projects/`, and `shares/`.

## Learning Mode

The maintainer is learning React, coming from a Vue.js background. After completing any implementation:

1. **Explain what was done** - Describe the React concepts, hooks, or patterns used
2. **Explain why** - Cover the reasoning and any trade-offs considered
3. **Vue.js parallels** - When relevant, relate React concepts to Vue equivalents (e.g., `useState` ≈ `ref()`, `useEffect` ≈ `watch`/lifecycle hooks, props/children ≈ props/slots)
4. **Keep it digestible** - Focus on the concepts most relevant to the change, not exhaustive explanations
5. **Provide links** - Include links (where possible) to relevant documentation or articles (React docs, blog posts, etc.) for deeper exploration
