import type { Preview } from '@storybook/react-vite';
import { MINIMAL_VIEWPORTS } from 'storybook/viewport';
import '@product-design-system/react/styles.css';

const preview: Preview = {
  initialGlobals: { theme: 'light' },
  globalTypes: {
    theme: {
      description: 'Figma semantic and chart token mode',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [{ value: 'light', title: 'Light' }, { value: 'dark', title: 'Dark' }],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => (
      <div className="pds-scope" data-theme={context.globals.theme === 'dark' ? 'dark' : 'light'}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    options: { storySort: { order: ['Foundations', 'Components', 'Accessibility', 'QA'] } },
    viewport: { options: MINIMAL_VIEWPORTS },
    backgrounds: { disable: true },
    a11y: {
      test: 'error',
      options: { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } },
    },
  },
};
export default preview;
