import { useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@product-design-system/react';

export function ModalFrame({ children }: { children: (open: boolean, setOpen: (open: boolean) => void) => ReactNode }) {
  const [open, setOpen] = useState(false);
  return <div style={{ minHeight: 360, display: 'grid', placeItems: 'center', padding: 48 }}>
    <Button size="medium" onClick={() => setOpen(true)}>Open surface</Button>
    {children(open, setOpen)}
  </div>;
}
