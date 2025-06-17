import { addons } from '@storybook/manager-api';
import { themes } from '@storybook/theming';

addons.setConfig({
    // Storybook's own UI theme — not your component theme
    theme: themes.light,
});
