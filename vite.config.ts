import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { type PluginOption, defineConfig } from 'vite';
import removeAttributesImport from 'vite-plugin-react-remove-attributes';

import { envValidator } from './vite-env-validator.ts';

type RemoveAttributesFactory = (options: {
    attributes: string[];
    include?: RegExp[];
    exclude?: RegExp[];
}) => PluginOption;

function resolveRemoveAttributes(): RemoveAttributesFactory {
    const plugin = removeAttributesImport as RemoveAttributesFactory | { default: RemoveAttributesFactory };
    if (typeof plugin === 'function') {
        return plugin;
    }
    return plugin.default;
}

const removeAttributes = resolveRemoveAttributes();

export default defineConfig(({ mode }) => ({
    resolve: {
        tsconfigPaths: true,
    },
    plugins: [
        envValidator(),
        tailwindcss(),
        react(),
        mode === 'production' &&
            process.env.E2E_TESTING !== 'true' &&
            removeAttributes({
                attributes: ['data-testid'],
                include: [/\.tsx$/],
                exclude: [/\.stories\.tsx$/],
            }),
    ],
}));
