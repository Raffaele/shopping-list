import { moveId } from './reorder';

describe('moveId', () => {
  it('moves an id to the target index', () => {
    expect(moveId(['a', 'b', 'c'], 'a', 2)).toEqual(['b', 'c', 'a']);
    expect(moveId(['a', 'b', 'c'], 'c', 0)).toEqual(['c', 'a', 'b']);
  });

  it('returns the same list when the move is a no-op or out of range', () => {
    const ids = ['a', 'b', 'c'];
    expect(moveId(ids, 'b', 1)).toBe(ids);
    expect(moveId(ids, 'a', -1)).toBe(ids);
    expect(moveId(ids, 'c', 3)).toBe(ids);
    expect(moveId(ids, 'x', 0)).toBe(ids);
  });
});
