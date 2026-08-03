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
pnpm gen:i18n
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

## Storybook and tests

- Stories: follow [.agents/skills/storybook/SKILL.md](../storybook/SKILL.md).
- Unit tests: follow [.agents/skills/testing/SKILL.md](../testing/SKILL.md).

## Extraction coverage

When splitting a component or hook (see the vendored
`.agents/skills/vendor/component-extraction/SKILL.md` for rule thresholds), keep
coverage aligned with the new artifacts:

| Artifact                                   | Unit test                     | Storybook story                              |
| ------------------------------------------ | ----------------------------- | -------------------------------------------- |
| Hook with logic                            | **Required** (`use*.test.ts`) | Optional                                     |
| Component with conditionals / side effects | **Required**                  | **Required**                                 |
| Thin presentational extraction             | Parent test may suffice       | Parent story may suffice (must render child) |

Optional extracted hooks live beside the component as `useComponentLogic.ts`
(or a more specific `use*.ts` name).
