import type { Meta, StoryObj } from '@storybook/react';

import { Header } from './Header';

const meta: Meta<typeof Header> = {
    title: 'components/shared/Header',
    component: Header,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
