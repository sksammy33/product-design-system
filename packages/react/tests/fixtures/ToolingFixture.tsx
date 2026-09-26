import { useState } from 'react';
import styles from './ToolingFixture.module.css';

// Verification-only native HTML fixture. Not a library component or public export.
export function ToolingFixture() {
  const [submitted, setSubmitted] = useState('');
  return (
    <main className={styles.fixture}>
      <h1>Tooling verification fixture</h1>
      <p>Native HTML used only to verify the toolchain. Not a Design System component.</p>
      <form aria-label="Tooling verification" onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(String(new FormData(event.currentTarget).get('message')));
      }}>
        <label htmlFor="tooling-message">Message</label>
        <input id="tooling-message" name="message" required />
        <button type="submit">Submit fixture</button>
      </form>
      <output aria-label="Submitted message" aria-live="polite">{submitted}</output>
    </main>
  );
}
