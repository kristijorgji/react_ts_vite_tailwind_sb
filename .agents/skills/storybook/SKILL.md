---
name: storybook
description: >
    Storybook conventions for this boilerplate. Use when writing or editing
    *.stories.tsx. Covers meta typing, title conventions, thin stories, and
    callbacks via Storybook fn().
---

# Storybook

Keep story files thin. Stories configure the component; avoid large inline domain
objects when a shared fixture or simple args suffice.

## Meta typing

Always type the default export:

```typescript
import type { Meta, StoryObj } from '@storybook/react';

import MyComponent from './MyComponent';

const meta = {
    title: 'Pages/MyComponent', // or 'components/shared/MyComponent'
    component: MyComponent,
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
```

Title conventions:

- Pages: `title: 'Pages/ComponentName'`
- Shared: `title: 'components/shared/ComponentName'`

## Variants

Add story variants when the component has distinct visual states (loading, error,
empty, populated).

## Callbacks

Use `fn()` from Storybook test utils for callback props — never empty no-op bodies.

## Interaction tests (`play`)

Prefer `canvas.getByTestId(...)` in `play` functions. Storybook uses real i18n and a locale
toolbar, so text/label queries break when the locale global changes. Use role/label queries only
when the play function is specifically asserting accessibility.

See also [testing](../testing/SKILL.md) (Queries table).

## Co-location

Every new component must have a co-located `ComponentName.stories.tsx`. For
extraction coverage (when a dedicated story is required vs parent suffices), see
[component-extraction](../component-extraction/SKILL.md).

## Global setup

Decorators, providers, and locale/theme setup live in [`.storybook/`](../../../.storybook/) —
do not duplicate global provider stacks inside individual story files.
