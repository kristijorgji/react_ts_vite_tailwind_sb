import type { Meta, StoryObj } from '@storybook/react';

import IndexPage from './IndexPage';

const meta: Meta<typeof IndexPage> = {
    title: 'Pages/Index',
    component: IndexPage,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
