import type { Meta, StoryObj } from '@storybook/react-vite';
import { Plus, ArrowRight, Settings } from 'lucide-react';
import { Button } from '@product-design-system/react';
import type { ButtonProps, ButtonVariant, ButtonSize } from '@product-design-system/react';
import type { ReactNode } from 'react';

const variants: ButtonVariant[] = ['primary', 'secondary', 'tertiary', 'ghost', 'destructive', 'destructive-secondary', 'link', 'destructive-ghost', 'destructive-link'];
const sizes: ButtonSize[] = ['xs', 'small', 'medium', 'large', 'xl'];
const Group = ({ children }: { children: ReactNode }) => <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--spacing-space-16)', padding: 'var(--spacing-space-24)' }}>{children}</div>;
type PlaygroundArgs = { children: string; variant: ButtonVariant; size: ButtonSize; loading: boolean; disabled: boolean };
const meta = {
  title: 'Components/Button', render: (args: PlaygroundArgs) => <Button {...args} />,
  args: { children: 'Button', variant: 'primary', size: 'medium', loading: false, disabled: false },
  argTypes: {
    variant: { control: 'select', options: variants }, size: { control: 'select', options: sizes },
    loading: { control: 'boolean' }, disabled: { control: 'boolean' },
  },
  decorators: [(Story) => <Group><Story /></Group>],
} satisfies Meta<PlaygroundArgs>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Variants: Story = { render: () => <>{variants.map(variant => <Button key={variant} variant={variant}>{variant}</Button>)}</> };
export const Sizes: Story = { render: () => <>{sizes.map(size => <Button key={size} size={size}>{size}</Button>)}</> };
export const Icons: Story = { render: () => <><Button leadingIcon={<Plus />}>Create</Button><Button trailingIcon={<ArrowRight />}>Continue</Button><Button leadingIcon={<Plus />} trailingIcon={<ArrowRight />}>Both icons</Button></> };
export const IconOnly: Story = { render: () => <>{sizes.map(size => <Button key={size} size={size} iconOnly aria-label={`Settings ${size}`}><Settings /></Button>)}</> };
export const Loading: Story = { render: () => <>{variants.map(variant => <Button key={variant} variant={variant} loading leadingIcon={<Plus />}>{variant}</Button>)}</> };
export const Disabled: Story = { render: () => <>{variants.map(variant => <Button key={variant} variant={variant} disabled>{variant}</Button>)}</> };
export const Selected: Story = { render: () => <>{variants.filter((v): v is Exclude<ButtonVariant, 'link' | 'destructive-link'> => v !== 'link' && v !== 'destructive-link').map(variant => <Button key={variant} variant={variant} selected>{variant}</Button>)}</> };
export const Light: Story = { ...Variants, globals: { theme: 'light' } };
export const Dark: Story = { ...Variants, globals: { theme: 'dark' } };
export const LongLabel: Story = { args: { children: 'Save all changes and continue to the next step of this workflow' } };
export const NarrowContainer: Story = { render: () => <div style={{ inlineSize: 'var(--spacing-space-128)' }}><Button leadingIcon={<Plus />}>Save all changes and continue</Button></div> };

// Compile-time contract: selected is not a Link state, and icon-only requires a name.
// @ts-expect-error Link has no Selected state.
const invalidLink: ButtonProps = { variant: 'link', selected: true, children: 'Link' };
// @ts-expect-error Icon-only controls require an explicit accessible name.
const unnamedIcon: ButtonProps = { iconOnly: true, children: <Plus /> };
void invalidLink; void unnamedIcon;
