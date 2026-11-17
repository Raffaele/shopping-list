import { db } from './db';

describe('db', () => {
  it('opens and writes/reads meta', async () => {
    await db.open();
    await db.meta.put({ key: 'hello', value: 42 });
    expect((await db.meta.get('hello'))?.value).toBe(42);
  });
});
