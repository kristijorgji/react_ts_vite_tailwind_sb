import type { Meta, StoryObj } from '@storybook/react';

import IndexPage from './IndexPage';

const meta = {
    title: 'Pages/Index',
    component: IndexPage,
} satisfies Meta<typeof IndexPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
