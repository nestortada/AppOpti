import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { Share2 } from 'lucide-react';

export default function ShareModal() {
  const [open, setOpen] = useState(false);
  const url = window.location.href;
  const copy = () => {
    navigator.clipboard.writeText(url);
    setOpen(false);
    alert('Copiado');
  };
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="fixed right-4 top-4 p-2 bg-white rounded shadow"><Share2 /></button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded">
          <Dialog.Title className="font-bold mb-2">Compartir</Dialog.Title>
          <input readOnly value={url} className="border w-full p-2" />
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white" onClick={copy}>Copiar enlace</button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
