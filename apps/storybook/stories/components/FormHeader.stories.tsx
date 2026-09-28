import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormHeader } from '@product-design-system/react';
import { BatchFrame } from './batch-a-fixtures';
const meta = { title: 'Components/Forms/Form Header', component: FormHeader, decorators: [(Story) => <BatchFrame><Story /></BatchFrame>], args: { title: 'Form Title', description: 'A short description explaining the purpose of this form.' } } satisfies Meta<typeof FormHeader>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Dark: Story = { globals: { theme: 'dark' } };
