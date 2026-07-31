import { RuleTester } from '@typescript-eslint/rule-tester';
import { describe, it } from 'vitest';

import { noSingleExportBarrelRules } from './no-single-export-barrel.js';

RuleTester.afterAll = () => undefined;
RuleTester.describe = describe;
RuleTester.it = it;

const rule = noSingleExportBarrelRules.plugins['no-single-export-barrel'].rules['no-single-export-barrel'];

const ruleTester = new RuleTester({
    languageOptions: {
        parserOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
        },
    },
});

ruleTester.run('no-single-export-barrel', rule, {
    valid: [
        {
            filename: '/repo/src/components/Foo/index.ts',
            code: `export { Foo } from './Foo';\nexport { Bar } from './Bar';\n`,
        },
        {
            filename: '/repo/src/components/Foo/index.ts',
            code: `export { createFoo } from './createFoo';\n`,
        },
        {
            filename: '/repo/src/components/Foo/Foo.ts',
            code: `export { Foo } from './Foo';\n`,
        },
        {
            filename: '/repo/src/lib/routing/index.ts',
            code: `export { AppLink } from './AppLink';\nexport { useLocale } from './useLocale';\n`,
        },
    ],
    invalid: [
        {
            filename: '/repo/src/components/Foo/index.ts',
            code: `export { Foo } from './Foo';\n`,
            errors: [{ messageId: 'noSingleExportBarrel' }],
        },
        {
            filename: '/repo/src/components/Bar/index.ts',
            code: `export { MapPickerDynamic } from './MapPickerDynamic';\n`,
            errors: [{ messageId: 'noSingleExportBarrel' }],
        },
    ],
});
