import { useState } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { Button, CheckboxGroup, RadioGroup, Select, Combobox, MultiSelect, FormField, FormGroup, FormRow, FormSection, FormHeader, FormFooter, FormActions } from '@product-design-system/react';
import { assertAccessible } from './accessibility';

const options = [
  { value: 'design', label: 'Design' },
  { value: 'archived', label: 'Archived', disabled: true },
  { value: 'engineering', label: 'Engineering' },
  { value: 'marketing', label: 'Marketing' },
];
afterEach(() => document.documentElement.removeAttribute('data-theme'));
const data = () => new FormData(document.querySelector('form')!);
const combo = (name = 'Team') => page.getByRole('combobox', { name });

test('Forms compose native fields, headings, validation and Button submit/cancel actions', async () => {
  const submit = vi.fn();
  const cancel = vi.fn();
  await render(<form onSubmit={event => { event.preventDefault(); submit(Object.fromEntries(new FormData(event.currentTarget))); }}>
    <FormHeader title="Profile" description="Tell us about yourself" />
    <FormSection title="Personal details" description="Use your preferred name">
      <FormGroup><FormRow columns={2}>
        <FormField name="first" label="First name" required />
        <FormField name="last" label="Last name" />
      </FormRow><FormField control="textarea" name="bio" label="Bio" helperText="A short introduction" /></FormGroup>
    </FormSection>
    <FormActions primaryAction={{ children: 'Save' }} secondaryAction={{ children: 'Cancel', onClick: cancel }} />
    <FormFooter>We keep your profile private.</FormFooter>
  </form>);
  await page.getByRole('button', { name: 'Save' }).click();
  expect(submit).not.toHaveBeenCalled();
  await page.getByRole('textbox', { name: 'First name' }).fill('Ada');
  await page.getByRole('textbox', { name: 'Bio' }).fill('Designer');
  await expect.element(page.getByRole('textbox', { name: 'Bio' })).toHaveAccessibleDescription('A short introduction');
  await page.getByRole('button', { name: 'Cancel' }).click();
  expect(cancel).toHaveBeenCalledOnce();
  expect(submit).not.toHaveBeenCalled();
  await page.getByRole('button', { name: 'Save' }).click();
  expect(submit).toHaveBeenCalledWith({ first: 'Ada', last: '', bio: 'Designer' });
  await assertAccessible(document.querySelector('form')!);
});

test('CheckboxGroup toggles native values, describes errors, disables options and resets', async () => {
  await render(<form><CheckboxGroup name="teams" label="Teams" options={options} defaultValue={['design']} error errorText="Choose active teams" />
    <Button type="reset">Reset</Button></form>);
  const engineering = page.getByRole('checkbox', { name: 'Engineering' });
  await engineering.click();
  expect(data().getAll('teams')).toEqual(['design', 'engineering']);
  await expect.element(engineering).toHaveAccessibleDescription('Choose active teams');
  await expect.element(page.getByRole('checkbox', { name: 'Archived' })).toBeDisabled();
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect.element(engineering).not.toBeChecked();
  expect(data().getAll('teams')).toEqual(['design']);
  await assertAccessible(document.querySelector('form')!);
});

test('RadioGroup retains native arrow navigation, required validation and form reset', async () => {
  await render(<form><RadioGroup name="team" label="Team" options={options} defaultValue="design" required />
    <Button type="reset">Reset</Button></form>);
  await page.getByRole('radio', { name: 'Design' }).click();
  await userEvent.keyboard('{ArrowDown}');
  await expect.element(page.getByRole('radio', { name: 'Engineering' })).toBeChecked();
  expect(data().get('team')).toBe('engineering');
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect.element(page.getByRole('radio', { name: 'Design' })).toBeChecked();
  await assertAccessible(document.querySelector('form')!);
});

test('Select keyboard navigation skips disabled options, selects, dismisses and preserves focus', async () => {
  await render(<form><Select name="team" label="Team" options={options} helperText="Choose one" /><Button>Next</Button></form>);
  await userEvent.tab();
  await expect.element(combo()).toHaveFocus();
  await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
  await expect.element(combo()).toHaveTextContent('Engineering');
  expect(data().get('team')).toBe('engineering');
  await expect.element(combo()).toHaveAttribute('aria-expanded', 'false');
  await expect.element(combo()).toHaveAccessibleDescription('Choose one');
  await userEvent.keyboard(' {End}');
  const activeId = combo().element().getAttribute('aria-activedescendant');
  expect(document.getElementById(activeId!)?.textContent).toBe('Marketing');
  await userEvent.keyboard('{Escape}');
  await expect.element(combo()).toHaveFocus();
  expect(data().get('team')).toBe('engineering');
  await userEvent.keyboard('m{Enter}');
  expect(data().get('team')).toBe('marketing');
  await userEvent.keyboard(' {Tab}');
  await expect.element(page.getByRole('button', { name: 'Next' })).toHaveFocus();
  await expect.element(combo()).toHaveAttribute('aria-expanded', 'false');
});

test('Select supports pointer choice, outside dismissal and native required validation', async () => {
  const submit = vi.fn();
  await render(<form onSubmit={event => { event.preventDefault(); submit(); }}><Button>Outside</Button><Select label="Team" name="team" options={options} required /><Button type="submit">Submit</Button></form>);
  await page.getByRole('button', { name: 'Submit' }).click();
  expect(submit).not.toHaveBeenCalled();
  await expect.element(combo()).toHaveFocus();
  await combo().click();
  await expect.element(page.getByRole('option', { name: 'Archived' })).toHaveAttribute('aria-disabled', 'true');
  await page.getByRole('option', { name: 'Archived' }).click({ force: true });
  expect(data().get('team')).toBe('');
  await page.getByRole('option', { name: 'Design', exact: true }).click();
  await page.getByRole('button', { name: 'Submit' }).click();
  expect(submit).toHaveBeenCalledOnce();
  await combo().click();
  await page.getByRole('button', { name: 'Outside' }).click();
  await expect.element(combo()).toHaveAttribute('aria-expanded', 'false');
});

test('Combobox filters, uses active descendants, clears and never submits an unselected query', async () => {
  const query = vi.fn();
  await render(<form><Combobox name="team" label="Team" options={options} onQueryChange={query} /><Button>Next</Button></form>);
  await combo().fill('eng');
  await expect.element(page.getByRole('option', { name: 'Engineering' })).toBeVisible();
  await expect.element(page.getByRole('option', { name: 'Design', exact: true })).not.toBeInTheDocument();
  expect(data().get('team')).toBe('');
  await userEvent.keyboard('{Enter}');
  await expect.element(combo()).toHaveValue('Engineering');
  expect(data().get('team')).toBe('engineering');
  await page.getByRole('button', { name: 'Clear Team' }).click();
  await expect.element(combo()).toHaveValue('');
  expect(data().get('team')).toBe('');
  await combo().fill('unknown');
  await expect.element(page.getByText('No options found')).toBeVisible();
  await userEvent.keyboard('{Escape}');
  await expect.element(combo()).toHaveValue('');
  expect(query).toHaveBeenCalledWith('unknown');
});

test('Combobox loading and disabled states are inert and named', async () => {
  const change = vi.fn();
  await render(<main className="pds-scope"><Combobox label="Loading team" options={options} loading onValueChange={change} />
    <Combobox label="Locked team" options={options} disabled defaultValue="design" /></main>);
  await combo('Loading team').click();
  await userEvent.keyboard('{ArrowDown}{Enter}');
  expect(change).not.toHaveBeenCalled();
  await expect.element(combo('Loading team')).toHaveAttribute('aria-busy', 'true');
  await expect.element(combo('Locked team')).toBeDisabled();
  await assertAccessible(page.getByRole('main').element());
});

test('MultiSelect toggles options, removes tags by keyboard and submits multiple values', async () => {
  await render(<form><MultiSelect name="teams" label="Team" options={options} /><Button>Next</Button></form>);
  await combo().click();
  await userEvent.keyboard('{Enter}{ArrowDown}{Enter}');
  expect(data().getAll('teams')).toEqual(['design', 'engineering']);
  await expect.element(page.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');
  await expect.element(page.getByRole('option', { name: 'Engineering' })).toHaveAttribute('aria-selected', 'true');
  await assertAccessible(document.querySelector('form')!);
  await userEvent.keyboard('{Escape}');
  page.getByRole('button', { name: 'Remove Design' }).element().focus();
  await userEvent.keyboard('{Enter}');
  expect(data().getAll('teams')).toEqual(['engineering']);
  await expect.element(combo()).toHaveFocus();
  await combo().click();
  await page.getByRole('option', { name: 'Engineering' }).click();
  expect(data().getAll('teams')).toEqual([]);
});

test('Composite controls reset to defaults and controlled values remain owned by the caller', async () => {
  function Controlled() {
    const [value, setValue] = useState('design');
    return <Select label="Controlled" options={options} value={value} onValueChange={setValue} />;
  }
  await render(<form><Select label="Select" name="select" options={options} defaultValue="design" />
    <Combobox label="Combo" name="combo" options={options} defaultValue="design" />
    <MultiSelect label="Multi" name="multi" options={options} defaultValue={['design']} />
    <Controlled /><Button type="reset">Reset</Button></form>);
  for (const label of ['Select', 'Combo', 'Multi', 'Controlled']) {
    await combo(label).click();
    await page.getByRole('option', { name: 'Engineering' }).click();
    if (label === 'Multi') await userEvent.keyboard('{Escape}');
  }
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect.element(combo('Combo')).toHaveValue('Design');
  await expect.element(combo('Controlled')).toHaveTextContent('Engineering');
  expect(data().get('select')).toBe('design');
  expect(data().get('combo')).toBe('design');
  expect(data().getAll('multi')).toEqual(['design']);
});

test('External form ownership, refs and disabled fieldset semantics work', async () => {
  const ref = { current: null as HTMLButtonElement | null };
  await render(<main><form id="owner" /><Select form="owner" label="External" name="external" options={options} defaultValue="design" ref={ref} />
    <fieldset disabled><legend>Locked</legend><Select label="Locked select" options={options} /><Combobox label="Locked combo" options={options} />
      <MultiSelect label="Locked multi" options={options} defaultValue={['design']} /></fieldset></main>);
  expect(data().get('external')).toBe('design');
  expect(ref.current).toBe(combo('External').element());
  for (const label of ['Locked select', 'Locked combo', 'Locked multi']) await expect.element(combo(label)).toBeDisabled();
});

test('Select sizes and corrected MultiSelect label/tag/field geometry match Figma', async () => {
  await page.viewport(900, 800);
  await render(<main className="pds-scope" style={{ width: 656 }}>
    {(['small', 'medium', 'large'] as const).map(size => <Select key={size} label={size} size={size} options={options} />)}
    <MultiSelect label="Tags" options={options} defaultValue={['design', 'engineering']} />
    <FormHeader title="Form Title" /><FormSection title="Section Title"><FormField label="Name" /></FormSection>
  </main>);
  await document.fonts.ready;
  for (const [size, height] of [['small', 32], ['medium', 40], ['large', 48]] as const) {
    expect(combo(size).element().getBoundingClientRect().height).toBe(height);
  }
  const control = combo('Tags').element().parentElement!;
  const tag = page.getByRole('button', { name: 'Remove Design' }).element().parentElement!;
  expect(control.getBoundingClientRect().height).toBe(40);
  expect(tag.getBoundingClientRect().height).toBe(20);
  expect(getComputedStyle(tag).fontSize).toBe('12px');
  expect(getComputedStyle(tag).lineHeight).toBe('16px');
  expect(getComputedStyle(tag).fontWeight).toBe('500');
  expect(getComputedStyle(page.getByRole('heading', { name: 'Form Title' }).element()).fontSize).toBe('24px');
  expect(getComputedStyle(page.getByRole('heading', { name: 'Section Title' }).element()).fontSize).toBe('18px');
  await page.getByRole('main').screenshot({ path: '.vitest-attachments/batch-a-geometry.png' });
});

test('Forms stack at narrow viewports and long selections stay within their field', async () => {
  await page.viewport(900, 800);
  await render(<main className="pds-scope" style={{ width: '100%', maxWidth: 656 }}>
    <FormHeader title="Profile" description="Manage your details and teams." />
    <FormRow id="responsive-row" columns={2}><FormField label="First name" /><FormField label="Last name" /></FormRow>
    <FormGroup id="responsive-group" direction="horizontal"><CheckboxGroup label="Topics" options={options} /><RadioGroup label="Primary team" options={options} /></FormGroup>
    <Combobox label="Search teams" options={options} helperText="Search or choose a team" />
    <MultiSelect label="Many teams" options={options} defaultValue={['design', 'engineering', 'marketing']} />
    <FormActions primaryAction={{ children: 'Save' }} secondaryAction={{ children: 'Cancel' }} />
    <FormFooter>Changes apply to your profile.</FormFooter>
  </main>);
  const row = document.getElementById('responsive-row')!;
  expect(row.children[0]!.getBoundingClientRect().top).toBe(row.children[1]!.getBoundingClientRect().top);
  for (const theme of ['light', 'dark']) {
    document.documentElement.dataset.theme = theme;
    await page.getByRole('main').screenshot({ path: `.vitest-attachments/batch-a-${theme}.png` });
  }
  await page.viewport(320, 800);
  expect(row.children[1]!.getBoundingClientRect().top).toBeGreaterThan(row.children[0]!.getBoundingClientRect().bottom);
  const group = document.getElementById('responsive-group')!;
  expect(group.children[1]!.getBoundingClientRect().top).toBeGreaterThan(group.children[0]!.getBoundingClientRect().bottom);
  const field = combo('Many teams').element().parentElement!;
  expect(field.getBoundingClientRect().height).toBe(40);
  expect(field.getBoundingClientRect().right).toBeLessThanOrEqual(320);
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(320);
  await assertAccessible(page.getByRole('main').element());
  await page.viewport(900, 800);
});

test('Batch A defaults, errors, selected values and open lists pass axe in Light and Dark', async () => {
  await render(<main className="pds-scope">
    <FormHeader title="Preferences" /><FormSection title="Your preferences">
      <CheckboxGroup label="Topics" options={options} defaultValue={['design']} />
      <RadioGroup label="Primary team" options={options} defaultValue="design" />
      <FormField label="Name" validation="error" validationMessage="Enter your name" />
      <Select label="Select" options={options} error errorText="Choose a team" />
      <Combobox label="Combo" options={options} defaultValue="engineering" />
      <MultiSelect label="Multi" options={options} defaultValue={['design', 'engineering']} />
    </FormSection><FormActions primaryAction={{ children: 'Save' }} /><FormFooter>Preferences are private.</FormFooter>
  </main>);
  for (const theme of ['light', 'dark']) {
    document.documentElement.dataset.theme = theme;
    await assertAccessible(page.getByRole('main').element());
    for (const label of ['Select', 'Combo', 'Multi']) {
      await combo(label).click();
      await assertAccessible(page.getByRole('main').element());
      await userEvent.keyboard('{Escape}');
    }
  }
});
