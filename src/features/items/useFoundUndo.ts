import { useState } from 'react';
import { shoppingFacade, type Item, type RemovedItem } from '@/db';

export function useFoundUndo() {
  const [removed, setRemoved] = useState<RemovedItem | null>(null);

  async function markFound(item: Item) {
    const result = await shoppingFacade.markFound(item.id);
    if (result) setRemoved(result);
  }

  async function undo() {
    if (!removed) return;
    await shoppingFacade.restoreItem(removed);
    setRemoved(null);
  }

  return {
    removed,
    markFound,
    undo,
    dismiss: () => {
      setRemoved(null);
    },
  };
}
