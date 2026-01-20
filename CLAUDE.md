# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev        # Start development server (Vite with HMR)
yarn build      # Type-check with tsc and build for production
yarn lint       # Run ESLint
yarn preview    # Preview production build locally
```

This project uses Yarn 4 (Berry) with Plug'n'Play (see .pnp.cjs).

## Architecture

This is a personal portfolio website built with React 19, TypeScript, and Vite.

**Routing:** React Router v7 with lazy-loaded routes. Entry point is `src/main.tsx` which wraps the app in `BrowserRouter`. Routes are defined in `src/routes.tsx` using `Suspense` for code splitting.

**Styling:** Tailwind CSS v4 via PostCSS (`@tailwindcss/postcss`). Global styles and custom animations (float, pulse) are in `src/index.css`. Uses the new v4 `@import 'tailwindcss'` syntax.

**UI Libraries:**
- `@headlessui/react` - Accessible UI primitives
- `@heroicons/react` - Icon set
- `react-icons` - Additional icons (currently using Font Awesome icons)

**Component Structure:** Components live in `src/components/`. The main `App.tsx` composes the page layout from component modules.
