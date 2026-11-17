import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { routes } from '@/app/router';
import { shoppingFacade, type NewItem } from '@/db';
import { db } from '@/db/db';
import i18n from '@/i18n';

type User = ReturnType<typeof userEvent.setup>;

function renderStore(storeId: string) {
  const router = createMemoryRouter(routes, { initialEntries: [`/stores/${storeId}`] });
  return render(<RouterProvider router={router} />);
}

function newItem(storeIds: string[], overrides: Partial<NewItem> = {}): NewItem {
  return { name: 'Milk', quantity: 1, priority: 2, storeIds, ...overrides };
}

async function openItemDialog(user: User, buttonName: string, dialogName: string) {
  await user.click(await screen.findByRole('button', { name: buttonName }));
  return screen.findByRole('dialog', { name: dialogName });
}

function itemNames(): string[] {
  const list = screen.getByRole('list', { name: 'Items' });
  return within(list)
    .getAllByRole('listitem')
    .map((row) => row.querySelector('span')?.textContent ?? '');
}

describe('StoreDetail', () => {
  beforeEach(async () => {
    await Promise.all([db.stores.clear(), db.items.clear(), db.storeItems.clear()]);
  });

  it('shows the not-found page for an unknown store', async () => {
    renderStore('missing');
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
  });

  it('shows the empty state and a zero count', async () => {
    const store = await shoppingFacade.createStore('Lidl');
    renderStore(store.id);
    expect(await screen.findByText('No items yet')).toBeInTheDocument();
    expect(screen.getByText('0 items')).toBeInTheDocument();
  });

  it('lists the items highest priority first with a count', async () => {
    const store = await shoppingFacade.createStore('Lidl');
    await shoppingFacade.createItem(newItem([store.id], { name: 'Bread', priority: 1 }));
    await shoppingFacade.createItem(newItem([store.id], { name: 'Eggs', priority: 3 }));
    await shoppingFacade.createItem(newItem([store.id], { name: 'Milk', priority: 2 }));
    renderStore(store.id);

    expect(await screen.findByText('3 items')).toBeInTheDocument();
    expect(itemNames()).toEqual(['Eggs', 'Milk', 'Bread']);
  });

  it('adds an item to this store and to another one', async () => {
    const user = userEvent.setup();
    const lidl = await shoppingFacade.createStore('Lidl');
    const aldi = await shoppingFacade.createStore('Aldi');
    renderStore(lidl.id);

    const dialog = await openItemDialog(user, 'Add item', 'Add item');
    await user.type(within(dialog).getByLabelText('Item name'), 'Oat milk');
    await user.clear(within(dialog).getByLabelText('Quantity'));
    await user.type(within(dialog).getByLabelText('Quantity'), '3');
    await user.click(within(dialog).getByRole('radio', { name: 'High' }));
    await user.click(within(dialog).getByRole('checkbox', { name: 'Aldi' }));
    await user.click(within(dialog).getByRole('button', { name: 'Add' }));

    expect(await screen.findByText('Oat milk')).toBeInTheDocument();
    expect(screen.getByText(/Qty: 3/)).toBeInTheDocument();
    const [stored] = await shoppingFacade.getStoreItems(lidl.id);
    expect(stored).toMatchObject({ name: 'Oat milk', quantity: 3, priority: 3 });
    expect(await shoppingFacade.getStoreItems(aldi.id)).toHaveLength(1);
  });

  it('keeps Add disabled for a blank name, an invalid quantity or no store', async () => {
    const user = userEvent.setup();
    const store = await shoppingFacade.createStore('Lidl');
    renderStore(store.id);

    const dialog = await openItemDialog(user, 'Add item', 'Add item');
    const add = within(dialog).getByRole('button', { name: 'Add' });
    expect(add).toBeDisabled();

    await user.type(within(dialog).getByLabelText('Item name'), 'Milk');
    expect(add).toBeEnabled();

    await user.clear(within(dialog).getByLabelText('Quantity'));
    await user.type(within(dialog).getByLabelText('Quantity'), '0');
    expect(add).toBeDisabled();

    await user.clear(within(dialog).getByLabelText('Quantity'));
    await user.type(within(dialog).getByLabelText('Quantity'), '1.5');
    expect(add).toBeDisabled();

    await user.clear(within(dialog).getByLabelText('Quantity'));
    await user.type(within(dialog).getByLabelText('Quantity'), '2');
    await user.click(within(dialog).getByRole('checkbox', { name: 'Lidl' }));
    expect(add).toBeDisabled();
    expect(within(dialog).getByText('Select at least one store.')).toBeInTheDocument();
  });

  it('edits an item, including its stores', async () => {
    const user = userEvent.setup();
    const lidl = await shoppingFacade.createStore('Lidl');
    const aldi = await shoppingFacade.createStore('Aldi');
    await shoppingFacade.createItem(newItem([lidl.id]));
    renderStore(lidl.id);

    const dialog = await openItemDialog(user, 'Edit Milk', 'Edit item');
    const name = within(dialog).getByLabelText('Item name');
    await user.clear(name);
    await user.type(name, 'Oat milk');
    await user.click(within(dialog).getByRole('radio', { name: 'Low' }));
    await user.click(await within(dialog).findByRole('checkbox', { name: 'Aldi' }));
    await user.click(within(dialog).getByRole('button', { name: 'Save' }));

    expect(await screen.findByText('Oat milk')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(await shoppingFacade.getStoreItems(lidl.id)).toMatchObject([
      { name: 'Oat milk', priority: 1 },
    ]);
    expect(await shoppingFacade.getStoreItems(aldi.id)).toHaveLength(1);
  });

  it('pre-fills the edit form with the current values and stores', async () => {
    const user = userEvent.setup();
    const lidl = await shoppingFacade.createStore('Lidl');
    const aldi = await shoppingFacade.createStore('Aldi');
    await shoppingFacade.createItem(newItem([lidl.id], { name: 'Eggs', quantity: 6, priority: 3 }));
    renderStore(lidl.id);

    const dialog = await openItemDialog(user, 'Edit Eggs', 'Edit item');
    expect(within(dialog).getByLabelText('Item name')).toHaveValue('Eggs');
    expect(within(dialog).getByLabelText('Quantity')).toHaveValue(6);
    expect(within(dialog).getByRole('radio', { name: 'High' })).toBeChecked();
    expect(await within(dialog).findByRole('checkbox', { name: 'Lidl' })).toBeChecked();
    expect(within(dialog).getByRole('checkbox', { name: aldi.name })).not.toBeChecked();
  });

  it('removes a found item from every store', async () => {
    const user = userEvent.setup();
    const lidl = await shoppingFacade.createStore('Lidl');
    const aldi = await shoppingFacade.createStore('Aldi');
    await shoppingFacade.createItem(newItem([lidl.id, aldi.id]));
    renderStore(lidl.id);

    await user.click(await screen.findByRole('button', { name: 'Mark Milk as found' }));

    expect(await screen.findByText('No items yet')).toBeInTheDocument();
    expect(await shoppingFacade.getStoreItems(aldi.id)).toEqual([]);
    expect(await db.items.count()).toBe(0);
  });

  it('opens a store from the stores list', async () => {
    const user = userEvent.setup();
    await shoppingFacade.createStore('Lidl');
    const router = createMemoryRouter(routes, { initialEntries: ['/'] });
    render(<RouterProvider router={router} />);

    await user.click(await screen.findByRole('link', { name: 'Lidl' }));

    expect(await screen.findByRole('heading', { name: 'Lidl' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Back to stores' }));
    expect(await screen.findByRole('list', { name: 'Stores' })).toBeInTheDocument();
  });
});

describe('item count plurals', () => {
  it.each([
    ['en', 1, '1 item'],
    ['en', 2, '2 items'],
    ['ru', 1, '1 товар'],
    ['ru', 3, '3 товара'],
    ['ru', 5, '5 товаров'],
    ['ru', 21, '21 товар'],
    ['de', 2, '2 Artikel'],
  ])('formats %s count %i as "%s"', async (lng, count, expected) => {
    await i18n.changeLanguage(lng);
    expect(i18n.t('items.count', { count })).toBe(expected);
  });
});
