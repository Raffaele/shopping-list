export function moveId(ids: string[], id: string, targetIndex: number): string[] {
  const from = ids.indexOf(id);
  if (from === -1 || targetIndex < 0 || targetIndex >= ids.length || from === targetIndex) {
    return ids;
  }
  const next = ids.filter((other) => other !== id);
  next.splice(targetIndex, 0, id);
  return next;
}

export function findIndexUnderPointer(
  ids: string[],
  rowOf: (id: string) => HTMLElement | undefined,
  pointerY: number,
): number {
  return ids.findIndex((id) => {
    const rect = rowOf(id)?.getBoundingClientRect();
    return rect !== undefined && pointerY >= rect.top && pointerY < rect.bottom;
  });
}
