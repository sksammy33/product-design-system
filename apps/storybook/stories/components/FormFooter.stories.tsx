import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormFooter } from '@product-design-system/react';
import { BatchFrame } from './batch-a-fixtures';
const meta = { title: 'Components/Forms/Form Footer', component: FormFooter, decorators: [(Story) => <BatchFrame><Story /></BatchFrame>], args: { children: 'By submitting this form, you agree to our Terms of Service and Privacy Policy.' } } satisfies Meta<typeof FormFooter>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Dark: Story = { globals: { theme: 'dark' } };
