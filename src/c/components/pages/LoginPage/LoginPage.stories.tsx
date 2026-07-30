import type { Meta, StoryObj } from '@storybook/react';

import LoginPage from './LoginPage';

const meta: Meta<typeof LoginPage> = {
    title: 'Pages/Login',
    component: LoginPage,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
