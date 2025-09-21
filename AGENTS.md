# Repository Guidelines

## Project Structure & Module Organization
The site is built with Astro 5 and served as a static bundle. Author new routes in `src/pages`, keeping one `.astro` file per public path. Shared UI lives in `src/components`; prefer reusing these before adding new ones. Global shells belong in `src/layouts`. Static assets (favicons, downloads, images) load from `public`; reference them with absolute paths (`/img/logo.svg`). Use `backup/` only for legacy experiments and avoid shipping files from there.

## Build, Test, and Development Commands
Run `npm install` once per environment. Use `npm run dev` for the hot-reloading local server. Validate production output with `npm run build`, which also surfaces Astro config errors. Preview the generated site exactly as it will deploy with `npm run preview`.

## Coding Style & Naming Conventions
Follow the existing two-space indentation inside `.astro`, HTML, and CSS blocks. Name new components in PascalCase (for example, `HeroBanner.astro`) and export helper scripts in camelCase. Keep inline styles scoped when practical; prefer extracting shared rules into a component-level `<style>` section. Favor semantic HTML, Spanish copy, and descriptive `alt` attributes for accessibility.

## Testing Guidelines
There is no automated test suite yet; rely on `npm run build` to catch compilation issues. Before opening a pull request, exercise critical flows manually in the preview server: navigation, contact links, and any new interactive widget. When adding scripts, document the expected behavior in the pull request so future contributors can extend tests later.

## Commit & Pull Request Guidelines
Existing history uses brief, imperative Spanish subjects (for example, `modo oscuro siempre`). Mirror that tone, keep to 50–60 characters, and group related changes per commit. Pull requests should include: a one-paragraph summary, linked issues (if any), screenshots or screen recordings for UI changes, and notes on manual checks. Request review from another maintainer before merging.

## Content & Localization Notes
This project targets a Spanish-speaking audience. Preserve consistent terminology across pages, reuse existing translations, and surface any English strings in the PR description so a reviewer can validate them.
