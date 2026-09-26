import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { cssVariables } from '@product-design-system/tokens';
import { ToolingFixture } from '../../../../packages/react/tests/fixtures/ToolingFixture';

const meta = {
  title: 'QA/Tooling fixture (not a component)',
  render: () => <ToolingFixture />,
  play: async ({ canvasElement, globals }) => {
    const canvas = within(canvasElement);
    const theme = globals.theme === 'dark' ? 'Dark' : 'Light';
    const scope = canvasElement.querySelector('.pds-scope')!;
    await expect(scope).toHaveAttribute('data-theme', theme.toLowerCase());
    const reference = document.createElement('span');
    reference.style.backgroundColor = cssVariables[theme]['--color-semantic-background-default'];
    scope.append(reference);
    await expect(getComputedStyle(scope).backgroundColor).toBe(getComputedStyle(reference).backgroundColor);
    reference.remove();
    await expect(canvas.getByRole('heading', { name: 'Tooling verification fixture' })).toBeVisible();
    await userEvent.type(canvas.getByRole('textbox', { name: 'Message' }), 'Storybook works');
    await userEvent.click(canvas.getByRole('button', { name: 'Submit fixture' }));
    await expect(canvas.getByRole('status', { name: 'Submitted message' })).toHaveTextContent('Storybook works');
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = {};
export const Dark: Story = { globals: { theme: 'dark' } };
