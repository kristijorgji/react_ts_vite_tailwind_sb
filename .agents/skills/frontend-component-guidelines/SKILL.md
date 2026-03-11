---
name: frontend-component-guidelines
description: >
  Use when creating, modifying, or reviewing React components in this project.
  Covers component structure, translations/i18n, Storybook stories, tests, and
  file organization. Do not use for backend or non-UI TypeScript code (see
  typescript-best-practices instead).
---

# Frontend Component Guidelines

## Check for Existing Components First

Before creating a new component, search the codebase for existing ones that can
be reused or extended:

- **Shared components:** `src/c/components/shared/`
- **Page components:** `src/c/components/pages/`
- **Templates/layouts:** `src/c/components/shared/templates/`

If an existing component partially fits, extend it with additional props rather
than duplicating it.

## Never Use Literal Strings in JSX

All user-facing text must go through the translation system (`react-i18next`).
The project enforces this via the `formatjs/no-literal-string-in-jsx` ESLint
rule.

```typescript
import { useTranslation } from 'react-i18next';

const AnalyticsPage: React.FC = () => {
    const { t } = useTranslation();
    usePageTitle(t('common:pages.analytics.title'));

    return (
        <PageContents>
            <div>{t('common:pages.analytics.title')}</div>
        </PageContents>
    );
};
```

When multiple namespaces are needed, pass them as an array:

```typescript
const { t } = useTranslation(['common', 'guest']);
t('common:pages.login.title');
t('guest:login.signInToAccount');
```

## Update All Locale Files

When adding or modifying translation keys, update **every** locale file:

- `public/locales/en/{namespace}.json`
- `public/locales/de/{namespace}.json`

Existing namespaces: `common`, `header`, `guest`. Create a new namespace only
when the scope clearly warrants it.

After updating locale JSON files, run:

```bash
yarn gen:i18n
```

This regenerates `src/i18n/resources.d.ts` so translation keys remain typed and
auto-completable.

## Component File Structure

Every component lives in its own folder following this pattern:

```
ComponentName/
├── ComponentName.tsx            # Component implementation
├── ComponentName.stories.tsx    # Storybook stories (required)
├── ComponentName.test.tsx       # Unit tests (required)
└── useComponentLogic.ts         # Optional: extracted hook for complex logic
```

### Placement

- **Page components** go in `src/c/components/pages/`.
- **Shared/reusable components** go in `src/c/components/shared/`.

## Storybook Stories

Every new component must have a Storybook story file. Follow the existing
pattern:

```typescript
import type { Meta, StoryObj } from '@storybook/react';

import MyComponent from './MyComponent';

const meta = {
    title: 'Pages/MyComponent',  // or 'components/shared/MyComponent'
    component: MyComponent,
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
```

Title conventions:

- Pages: `title: 'Pages/ComponentName'`
- Shared: `title: 'components/shared/ComponentName'`

Add multiple story variants when the component has distinct visual states (e.g.,
loading, error, empty, populated).

## Tests

Every new component must have a test file using **Vitest** and
**React Testing Library**.

Mock `react-i18next` when the component uses translations:

```typescript
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));
```

Test guidelines:

- Test that the component renders without crashing.
- Test user interactions (clicks, form inputs, etc.).
- Test conditional rendering (error states, loading states, empty states).
- Use `screen.getByRole`, `screen.getByLabelText`, and other accessible queries
  over `getByTestId` whenever possible.
- See existing tests in `src/c/components/pages/LoginPage/LoginPage.test.tsx`
  and `src/c/components/shared/Header/Header.test.tsx` as references.
