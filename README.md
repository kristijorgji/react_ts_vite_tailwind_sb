# react_ts_vite_tailwind_sb

**react_ts_vite_tailwind_sb** is a modern React + TypeScript template.

---

## Table of Contents

- [🚀 Tech Stack](#-tech-stack)
- [🛠️ Getting Started](#-getting-started)
    - [1. Install Dependencies](#1-install-dependencies)
    - [2. Set Up Environment Variables](#2-set-up-environment-variables)
    - [3. Start The Web](#3-start-the-web)
- [🧑‍💻 Local Development](#local-development)
    - [1. Using React Why-Did-You-Render](#using-react-wdyr-why-did-you-render)
- [✅ Testing](#-testing)
- [🧹 Code quality](#-code-quality--git-hooks)
- [🌐 Translations](#translations)
    - [1. Find Hardcoded Strings](#find-hardcoded-strings)
- [🧭 Navigation](#-navigation)
    - [1. Guidelines](#routing-guidelines)
    - [2. Best practices](#routing-best-practices)
- [❓ Troubleshooting](#troubleshooting)
    - [1. Storybook test errors](#storybook-test-errors)
- [📄 License](#license)

---

## 🚀 Tech Stack

Built with a modern toolchain for speed, scalability, and developer experience:

- ⚡ [Vite](https://vite.dev/) — lightning-fast build tool
- 💅 [Tailwind CSS](https://tailwindcss.com/) — utility-first styling & CSS framework
- 🧹 [ESLint](https://eslint.org/) — code linting
- 🎨 [Prettier](https://prettier.io/) — code formatting
- 🧪 [Vitest](https://vitest.dev/) + [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) — unit testing
- 🧩 [Storybook](https://storybook.js.org/) — component development and testing environment
- 🌐 [i18next](https://www.i18next.com/) — Internationalization framework used for managing translations

---

## 🛠️ Getting Started

### 1. Install Dependencies

```shell
yarn install
```

### 2. Set Up Environment Variables

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

We **recommend** to add all env vars into [env.ts](src/env.ts) and use like e.g: `env.appEnv` in order to abstract the
source of value.

### 3. Start The Web

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

## 🧑‍💻Local development

You can use either

```shell
yarn dev
```

to start with hot module reload the page locally.

Or you can work with the components library by using `storybook`

```shell
yarn storybook
```

## Using React WDYR (Why Did You Render)

[React Why Did You Render](https://github.com/welldone-software/why-did-you-render) is a helpful tool for detecting
unnecessary component re-renders and improving your React app’s performance.

### 🧩 What It Does

It monkey-patches React to track render behavior of components and logs when they re-render without prop or state
changes.

### ⚙️ How to Enable / Disable

You can control whether WDYR runs through your environment configuration:

```bash
# .env
VITE_WDYR=true   # Enable WDYR in development
VITE_WDYR=false  # Disable WDYR
```

By default, it should only be enabled in **development** to avoid affecting performance in production.

### 🚀 Usage

When enabled, WDYR automatically logs render information to the browser console.  
Use it to identify components that re-render unnecessarily and optimize their performance with `React.memo`, `useMemo`,
or `useCallback`.

### 📝 Example Setup

1. Create a file named `wdyr.ts` in your `src` folder:
   ```ts
   import React from 'react';

   if (import.meta.env.MODE === 'development' && import.meta.env.VITE_WDYR === 'true') {
     const { default: whyDidYouRender } = await import('@welldone-software/why-did-you-render');
     whyDidYouRender(React, {
       trackAllPureComponents: true,
     });
   }
   ```

2. Import it **before any React rendering** in your `main.tsx`:
   ```ts
   import './wdyr'; // Must be imported before ReactDOM.createRoot

   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import App from './App';

   ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
   ```

Now your app will log detailed WDYR output when `VITE_WDYR=true`.

## ✅ Testing

The frontend components are tested using:

- **Unit tests** – to verify component logic and behavior.
- **Snapshot tests** – to ensure the rendered output remains consistent over time.

We use [Vitest](https://vitest.dev/) together
with [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) for a fast and modern
testing workflow.

### 🧪 Test Selectors (`data-testid`)

For:

- **Storybook interaction tests**
- **Automated QA / E2E testing**

we use the `data-testid` attribute on relevant components.

These attributes are **automatically stripped from production builds** to keep the DOM clean and avoid leaking testing
hooks into production.

This is handled via the Vite plugin:

```ts
import removeAttributes from 'vite-plugin-react-remove-attributes';

removeAttributes({
    attributes: ['data-testid'],
});
```

The removal runs **only in production mode** via the Vite configuration.

### ▶️ Running tests & updating snapshots

```shell
yarn test -u
```

---

## 🧹 Code Quality & Git Hooks

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

## 🌐Translations

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

### Find Hardcoded Strings

To identify strings that need to be translated, follow these steps:

1. uncomment the line ` // translationsEslintConfig`
2. Adjust the file [eslint.translations.config.js](eslint.translations.config.js) ignores and rules as needed
3. run `yarn lint`

---

## 🧭 Navigation

This project uses localization combined with custom routing logic to handle multi-language paths seamlessly.

### Routing Guidelines

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

## ❓Troubleshooting

### Storybook test errors

If you encounter unexpected errors like the one above with Storybook's tests, especially related to module resolution,
and you are certain
your code is correct, the issue is often a corrupted cache or `yarn dev` is still running.

```text
TypeError: 
Click to debug the error directly in Storybook: http://localhost:6006/?path=/story/pages-automation--default&addonPanel=storybook/test/panel

Failed to fetch dynamically imported module: http://localhost:63315/node_modules/.vite/deps/react-18-EFOB4VSV.js?v=526442b3
```

To fix this, rebuild Storybook and then re-run your tests:

```shell
yarn storybook:build
yarn test
```

## 📄License

This project is licensed under the MIT License.

See the [LICENSE](./LICENSE.md) file for more details.
