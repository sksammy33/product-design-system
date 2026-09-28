import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormGroup, FormField } from '@product-design-system/react';
import { BatchFrame } from './batch-a-fixtures';
const meta = { title: 'Components/Forms/Form Group', component: FormGroup, decorators: [(Story) => <BatchFrame><Story /></BatchFrame>], args: { children: <><FormField label="First Name" placeholder="Enter first name" /><FormField label="Last Name" placeholder="Enter last name" /></> } } satisfies Meta<typeof FormGroup>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Vertical: Story = {};
export const Horizontal: Story = { args: { direction: 'horizontal' } };
export const Dark: Story = { ...Horizontal, globals: { theme: 'dark' } };
