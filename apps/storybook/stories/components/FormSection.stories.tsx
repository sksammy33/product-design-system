import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormSection, FormGroup, FormField } from '@product-design-system/react';
import { BatchFrame } from './batch-a-fixtures';
const meta = { title: 'Components/Forms/Form Section', component: FormSection, decorators: [(Story) => <BatchFrame><Story /></BatchFrame>], args: {
 title: 'Section Title', description: 'A brief description of this form section and what information is needed.',
 children: <FormGroup><FormField label="First Name" placeholder="Enter first name" /><FormField label="Last Name" placeholder="Enter last name" /></FormGroup>
} } satisfies Meta<typeof FormSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Dark: Story = { globals: { theme: 'dark' } };
