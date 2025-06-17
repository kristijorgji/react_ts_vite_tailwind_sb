import type { StorybookConfig } from '@storybook/react-vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: ['@storybook/addon-essentials', '@chromatic-com/storybook', '@storybook/experimental-addon-test'],
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
    viteFinal: (config) => {
        config.plugins = config.plugins || [];
        // sync same path aliases as the ones we use for vite
        config.plugins.push(tsconfigPaths());

        return config;
    },
};
export default config;
