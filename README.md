# react_ts_vite_tailwind_sb

**react_ts_vite_tailwind_sb** is a modern React + TypeScript template.

---

# Table of Contents

- [🚀 Tech Stack](#-tech-stack)
- [🛠️ Getting Started](#-getting-started)
    - [1. Install Dependencies](#1-install-dependencies)
    - [2. Set Up Environment Variables](#2-set-up-environment-variables)
    - [3. Start The Web](#3-start-the-web)
- [🧑‍💻 Local Development](#local-development)
- [✅ Testing](#-testing)
- [🧹 Code quality](#-code-quality--git-hooks)
- [🌐 Translations](#translations)
    - [1. Guidelines](#guidelines)
    - [2. Best practices](#routing-best-practices)
- [🧭 Navigation](#-navigation)
- [📄 License](#license)

---

## 🚀 Tech Stack

Built with a modern toolchain for speed, scalability, and developer experience:

- ⚡ [Vite](https://vite.dev/) — lightning-fast build tool
- 💅 [Tailwind CSS](https://tailwindcss.com/) — utility-first styling & CSS framework
- 🧹 Eslint — code linting
- 🎨 Prettier — code formatting
- 🧪 [Vitest](https://vitest.dev/) + @testing-library/react — unit testing
- 🧩 [Storybook](https://storybook.js.org/) — component development and testing environment
- 🌐 [i18next](https://www.i18next.com/) — Internationalization framework used for managing translations

---

# 🛠️ Getting Started

## 1. Install Dependencies

```shell
yarn install
```

## 2. Set Up Environment Variables

Create a `.env` file based on the provided template:

```shell
cp .env.dist .env
```

Then, edit `.env` and fill in the correct values.

> ⚠️ **Note:** All frontend-accessible environment variables must be prefixed with `VITE_`.  
> You can access them via `import.meta.env`, for example:

```ts
const apiBasePath = import.meta.env.VITE_API_BASE_PATH;
```

The variables that are intended to be used into the frontend code must start with
`VITE_` and can be used like for example `import.meta.env.VITE_API_BASE_PATH`

## 3. Start The Web

Development mode

```shell
yarn dev
```

Build for production

```shell
yarn build
```

You can preview locally

```shell
yarn preview
```

---

# 🧑‍💻Local development

You can use either

```shell
yarn dev
```

to start with hot module reload the page locally.

Or you can work with the components library by using `storybook`

```shell
yarn storybook
```

# ✅ Testing

The frontend components are tested using:

- **Unit tests** – to verify component logic and behavior.
- **Snapshot tests** – to ensure the rendered output remains consistent over time.

We use [Vitest](https://vitest.dev/) together
with [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) for a fast and modern
testing workflow.

To run tests and update snapshots

```shell
yarn test -u
```

---

# 🧹 Code Quality & Git Hooks

To ensure consistent code quality and commit standards, the project uses:

- [Husky](https://typicode.github.io/husky) – to manage Git hooks.
- [lint-staged](https://github.com/okonet/lint-staged) – to run linters on staged files before committing.
- [commitlint](https://commitlint.js.org/) – to enforce conventional commit messages.

### Setup

Git hooks are automatically enabled when you install dependencies via:

```bash
yarn install
```

### Usage

- On every `git commit`, Husky will run `lint-staged` to:
    - Lint and format your staged files using ESLint and Prettier.
- Commit messages are validated using Commitlint to follow conventional commit standards.

You can run these manually as well:

```bash
yarn lint
yarn fix
```

### Conventional Commit Examples

Here are some common commit types used with commitlint:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style (formatting, missing semi colons, etc)
- `refactor`: Code changes that neither fix a bug nor add a feature
- `test`: Adding or fixing tests
- `chore`: Other changes that don’t modify src or test files

**Examples**:

```bash
git commit -m "feat: add user authentication flow"
git commit -m "fix: resolve navigation bug on login page"
git commit -m "docs: update README with setup instructions"
git commit -m "style: format files with prettier"
git commit -m "refactor: simplify form validation logic"
git commit -m "test: add unit tests for auth reducer"
git commit -m "chore: update dependencies"
```

---

# 🌐Translations

This project leverages [i18next](https://www.i18next.com/) for full i18n support.

- Translation files are located in: `public/locales`
- Main config: [`i18n.ts`](src/i18n/i18n.ts)
- Supported and default locales: [`locales.ts`](src/i18n/locales.ts)
- Extra default configuration is located at [config.ts](src/core/config.ts) key `localization` in order to specify
  if you want to use locales in the path parameters and whether to use prefix for the default locale

To generate TypeScript type definitions for the locale files, run:

```shell
yarn gen:i18n
```

This enables full type safety and better developer experience when working with translations.

---

# 🧭 Navigation

This project uses localization combined with custom routing logic to handle multi-language paths seamlessly.

### Guidelines

- Define your routes inside [routes.ts](src/core/routing/routes.ts)
- Define route-to-component mapping in [routesConfig.tsx](src/core/routing/routesConfig.tsx)
- Define routes for the non-default locales only for the paths you want to override.
- Example:

```ts
export const ROUTES: LocalizedRouteMap = {
    [LOCALES.ENGLISH]: {
        [ROUTES_IDS.INDEX]: {href: "/"},
        [ROUTES_IDS.LOGIN]: {href: "/login"},
        [ROUTES_IDS.SETTINGS]: {href: "/settings"},
    },
    [LOCALES.GERMAN]: {
        [ROUTES_IDS.LOGIN]: {href: "/anmelden"},
    },
} as const;
```

If we have locale `de` and try to open `/settings` the page will open in locale `de` although there is no route
specified for de,
it will fallback to the default locale `en` route.

Unspecified locale routes fall back to default locale (`en`) automatically.

### Routing Best Practices

- Define route-to-component mapping in [routesConfig.tsx](src/core/routing/routesConfig.tsx)
- Use custom routing utilities from `@/core/routing` — avoid `react-router-dom` directly
- Use [createLocalizedRoute.tsx](src/core/routing/createLocalizedRoute.tsx) instead of `Route`
- Use `localizeRoutePath` from [localizedRoute.ts](src/core/routing/localizedRoute.ts) to generate locale-aware paths
- Use [NavLink.tsx](src/core/routing/NavLink.tsx) to generate locale-aware Links
- Navigate via `navigate` from [useNavigate.ts](src/core/routing/useNavigate.ts)
- Get the current matched route [useMatchedRoute.ts](src/core/routing/useMatchedRoute.ts)
- Always reference routes via `ROUTE_IDS` for consistency and safety across locales

---

# 📄License

This project is licensed under the MIT License.

See the [LICENSE](./LICENSE.md) file for more details.
