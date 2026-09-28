import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormField } from '@product-design-system/react';
import { BatchFrame } from './batch-a-fixtures';
const meta = { title: 'Components/Forms/Form Field', component: FormField, args: { label: 'Label', placeholder: 'Placeholder', helperText: 'Helper text goes here' }, decorators: [(Story) => <BatchFrame><Story /></BatchFrame>] } satisfies Meta<typeof FormField>;
export default meta;
type Story = StoryObj;
export const Playground: Story = {};
export const Variants: Story = { render: () => <>
  <FormField label="Default" placeholder="Placeholder" helperText="Helper text goes here" />
  <FormField label="Error" validation="error" validationMessage="Enter a valid value" />
  <FormField label="Warning" validation="warning" validationMessage="Review this value" />
  <FormField label="Success" validation="success" validationMessage="Value accepted" />
  <FormField label="Required" required />
  <FormField control="textarea" label="Description" placeholder="Enter your text here..." helperText="Helper text goes here" />
</> };
export const Dark: Story = { ...Variants, globals: { theme: 'dark' } };
