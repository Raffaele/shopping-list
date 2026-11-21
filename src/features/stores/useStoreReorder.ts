import { useCallback, useEffect, useRef, useState } from 'react';
import { shoppingFacade, type Store } from '@/db';
import { findIndexUnderPointer, moveId } from './reorder';

const KEY_STEP: Record<string, number> = { ArrowUp: -1, ArrowDown: 1 };

export function useStoreReorder(stores: Store[]) {
  const [draftIds, setDraftIds] = useState<string[] | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const latestIds = useRef<string[]>([]);
  const rows = useRef(new Map<string, HTMLElement>());

  const savedIds = stores.map((store) => store.id);
  const orderedIds = draftIds ?? savedIds;
  const byId = new Map(stores.map((store) => [store.id, store]));
  const orderedStores = orderedIds.flatMap((id) => byId.get(id) ?? []);

  const save = useCallback(
    async (ids: string[]) => {
      const changed = ids.some((id, index) => id !== stores[index]?.id);
      if (changed) await shoppingFacade.reorderStores(ids);
      setDraftIds(null);
    },
    [stores],
  );

  useEffect(() => {
    if (draggedId === null) return;
    const onMove = (event: PointerEvent) => {
      const target = findIndexUnderPointer(
        latestIds.current,
        (id) => rows.current.get(id),
        event.clientY,
      );
      latestIds.current = moveId(latestIds.current, draggedId, target);
      setDraftIds(latestIds.current);
    };
    const onEnd = () => {
      setDraggedId(null);
      void save(latestIds.current);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onEnd);
    window.addEventListener('pointercancel', onEnd);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onEnd);
      window.removeEventListener('pointercancel', onEnd);
    };
  }, [draggedId, save]);

  const startDrag = (id: string) => {
    latestIds.current = orderedIds;
    setDraggedId(id);
  };

  const moveByKey = (id: string, key: string) => {
    const step = KEY_STEP[key];
    if (step === undefined) return false;
    const next = moveId(orderedIds, id, orderedIds.indexOf(id) + step);
    setDraftIds(next);
    void save(next);
    return true;
  };

  const registerRow = (id: string) => (element: HTMLElement | null) => {
    if (element) rows.current.set(id, element);
    else rows.current.delete(id);
  };

  return { orderedStores, draggedId, startDrag, moveByKey, registerRow };
}
