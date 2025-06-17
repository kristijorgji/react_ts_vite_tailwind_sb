// eslint-disable-next-line import/order
import i18n from '../src/i18n/i18n.ts';

import React, { useEffect, useRef } from 'react';

import { type Decorator, type Preview } from '@storybook/react';

import '../src/index.css';
import '../src/App.css';

import { ThemeProvider } from '@/c/contexts/Theme/ThemeProvider';
import useTheme from '@/c/contexts/Theme/useTheme.ts';
import { addOrUpdateUrlQueryParameter } from '@/c/utils/http.ts';

import { LOCALES, LOCALE_FLAGS, getLocalesSelectionItems } from '../src/i18n/locales.ts';

const localeItems = getLocalesSelectionItems();

export const globalTypes: Preview['globalTypes'] = {
    // Add a button for light/dark mode in the toolbar
    theme: {
        name: 'Theme',
        description: 'Global theme for components',
        table: {
            defaultValue: {
                summary: 'light',
            },
        },
        toolbar: {
            icon: 'circlehollow',
            items: [
                { value: 'light', icon: 'circlehollow', title: 'Light' },
                { value: 'dark', icon: 'circle', title: 'Dark' },
            ],
            showName: true,
        },
    },
    locale: {
        name: 'Locale',
        description: 'Internationalization locale',
        table: {
            defaultValue: {
                summary: LOCALES.ENGLISH,
            },
        },
        toolbar: {
            icon: 'globe',
            items: localeItems.map((e) => ({
                value: e.value,
                title: e.text,
                right: LOCALE_FLAGS[e.value],
            })),
            showName: true,
        },
    },
};

export const initialGlobals: Preview['initialGlobals'] = {
    theme: 'light',
};

// eslint-disable-next-line react-refresh/only-export-components
const ThemeSyncWrapper = ({
    children,
    storyBookTheme,
}: {
    children: React.ReactNode;
    storyBookTheme: 'light' | 'dark';
}) => {
    const { theme: appTheme, toggleTheme } = useTheme();
    // const [_, updateGlobals] = useGlobals();
    const prevStoryBookTheme = useRef(storyBookTheme);
    const prevAppTheme = useRef(appTheme);

    useEffect(() => {
        // sync Storybook globals.theme → your ThemeProvider
        if (storyBookTheme !== prevStoryBookTheme.current) {
            toggleTheme();
        } else if (storyBookTheme !== appTheme) {
            // Sync your ThemeProvider → Storybook globals + <html> class
            // TODO this doesn't work!!! so we resolve to the next hacky workaround that requires a page reload
            // addons.getChannel().emit('globals:update', {
            //     globals: { theme: appTheme },
            // });

            const globals = new URL(window.location.href).searchParams.get('globals');
            // because window.location.href is an iframe where storybook displays the story
            window.top.location.href = addOrUpdateUrlQueryParameter(
                convertIframeUrlToStoryUrl(window.location.href),
                'globals',
                updateGlobalsString(globals, {
                    theme: appTheme,
                })
            );

            //
            // // change storybook theme for the tool itself - doesn't work
            // addons.setConfig({
            //     theme: appTheme === 'light' ? themes.light : themes.dark,
            // });

            // Update document class for canvas background
            const root = document.documentElement;
            root.classList.toggle('dark', appTheme === 'dark');
        }

        prevStoryBookTheme.current = storyBookTheme;
        prevAppTheme.current = appTheme;
    }, [storyBookTheme, appTheme, toggleTheme]);

    return children;
};

/**
 * Custom Storybook decorator to sync the selected theme and locale between Storybook and our app.
 *
 * - Applies the theme and locale chosen in Storybook to our components.
 * - Listens to changes from our ThemeProvider (e.g., via a theme toggle button)
 *   and updates Storybook's controls accordingly.
 */
const withThemeAndLocale: Decorator = (Story, context) => {
    const { locale } = context.globals;

    // sync the locale chosen in the custom storybook locale toolbar with the one we use for the components
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (locale && i18n.language !== locale) {
            i18n.changeLanguage(locale);
        }
    }, [locale]);

    return (
        <ThemeProvider>
            <ThemeSyncWrapper storyBookTheme={context.globals.theme}>
                <div
                    style={{
                        backgroundColor: context.globals.theme === 'dark' ? '#000' : '#fff',
                    }}
                >
                    <Story />
                </div>
            </ThemeSyncWrapper>
        </ThemeProvider>
    );
};

export const decorators: Preview['decorators'] = [withThemeAndLocale];

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
};

export default preview;

/**
 * Temporary hack until a proper solution to update globals.theme is found
 * @see https://stackoverflow.com/questions/79633809/how-can-i-update-storybook-global-theme-syncing
 * @see https://github.com/storybookjs/storybook/discussions/31548
 */
function convertIframeUrlToStoryUrl(iframeUrl: string): string {
    const url = new URL(iframeUrl);
    const storyId = url.searchParams.get('id');

    if (!storyId) {
        throw new Error('Missing story ID in URL');
    }

    // Replace the path and search params to match the standard Storybook URL
    url.pathname = '/';
    url.search = `?path=/story/${storyId}`;

    return url.toString();
}

/**
 * Updates or adds multiple key-value pairs in a 'globals' string.
 *
 * @param globals - A semicolon-separated string like 'theme:dark;locale:en'
 * @param updates - An object with key-value pairs to update or add (e.g. { theme: 'light', locale: 'fr' })
 * @returns A new 'globals' string with the updated key-value pairs
 */
export function updateGlobalsString(globals: string, updates: Record<string, string>): string {
    const pairs = globals
        .split(';')
        .map((pair) => pair.trim())
        .filter(Boolean);

    const map = new Map<string, string>();

    for (const pair of pairs) {
        const [k, v] = pair.split(':');
        if (k && v) {
            map.set(k, v);
        }
    }

    for (const [key, value] of Object.entries(updates)) {
        map.set(key, value);
    }

    return Array.from(map.entries())
        .map(([k, v]) => `${k}:${v}`)
        .join(';');
}
