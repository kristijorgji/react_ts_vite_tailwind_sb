import type { Meta, StoryObj } from '@storybook/react';

import LoginPage from './LoginPage';

const meta = {
    title: 'Pages/Login',
    component: LoginPage,
} satisfies Meta<typeof LoginPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
