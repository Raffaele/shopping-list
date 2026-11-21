import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { routes } from '@/app/router';
import { db } from '@/db/db';
import { shoppingFacade } from '@/db';

function renderHome() {
  const router = createMemoryRouter(routes, { initialEntries: ['/'] });
  return render(<RouterProvider router={router} />);
}

type User = ReturnType<typeof userEvent.setup>;

async function addStore(user: User, name: string) {
  await user.click(screen.getByRole('button', { name: 'Add store' }));
  const dialog = await screen.findByRole('dialog', { name: 'Add store' });
  await user.type(within(dialog).getByLabelText('Store name'), name);
  await user.click(within(dialog).getByRole('button', { name: 'Add' }));
}

describe('Home (stores)', () => {
  beforeEach(async () => {
    await Promise.all([db.stores.clear(), db.items.clear(), db.storeItems.clear()]);
  });

  it('shows the empty state', async () => {
    renderHome();
    expect(await screen.findByText('No stores yet')).toBeInTheDocument();
  });

  it('keeps Add disabled for a blank name', async () => {
    const user = userEvent.setup();
    renderHome();
    await user.click(screen.getByRole('button', { name: 'Add store' }));
    const dialog = await screen.findByRole('dialog', { name: 'Add store' });
    await user.type(within(dialog).getByLabelText('Store name'), '   ');
    expect(within(dialog).getByRole('button', { name: 'Add' })).toBeDisabled();
  });

  it('adds a store through the modal and persists it', async () => {
    const user = userEvent.setup();
    renderHome();
    await addStore(user, 'Lidl');

    const list = await screen.findByRole('list', { name: 'Stores' });
    expect(within(list).getByText('Lidl')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect((await shoppingFacade.getStores()).map((store) => store.name)).toEqual(['Lidl']);
  });

  it('renames a store', async () => {
    const user = userEvent.setup();
    await shoppingFacade.createStore('Lidl');
    renderHome();

    await user.click(await screen.findByRole('button', { name: 'Rename Lidl' }));
    const dialog = await screen.findByRole('dialog', { name: 'Rename store' });
    const input = within(dialog).getByLabelText('Store name');
    await user.clear(input);
    await user.type(input, 'Aldi');
    await user.click(within(dialog).getByRole('button', { name: 'Save' }));

    expect(await screen.findByText('Aldi')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect((await shoppingFacade.getStores()).map((store) => store.name)).toEqual(['Aldi']);
  });

  it('asks for confirmation before deleting a store and its orphan items', async () => {
    const user = userEvent.setup();
    const store = await shoppingFacade.createStore('Lidl');
    await shoppingFacade.createItem({
      name: 'Milk',
      quantity: 1,
      priority: 2,
      storeIds: [store.id],
    });
    renderHome();

    await user.click(await screen.findByRole('button', { name: 'Delete Lidl' }));
    const dialog = await screen.findByRole('alertdialog', { name: 'Delete store?' });
    await user.click(within(dialog).getByRole('button', { name: 'Delete' }));

    expect(await screen.findByText('No stores yet')).toBeInTheDocument();
    expect(await db.items.count()).toBe(0);
  });

  it('keeps the store when the deletion is cancelled', async () => {
    const user = userEvent.setup();
    await shoppingFacade.createStore('Lidl');
    renderHome();

    await user.click(await screen.findByRole('button', { name: 'Delete Lidl' }));
    const dialog = await screen.findByRole('alertdialog');
    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(screen.getByText('Lidl')).toBeInTheDocument();
    expect(await shoppingFacade.getStores()).toHaveLength(1);
  });

  it('reorders stores with the keyboard and persists the order', async () => {
    const user = userEvent.setup();
    await shoppingFacade.createStore('Lidl');
    await shoppingFacade.createStore('Aldi');
    renderHome();

    const handle = await screen.findByRole('button', { name: /^Reorder Lidl/ });
    handle.focus();
    await user.keyboard('{ArrowDown}');

    await waitFor(async () => {
      expect((await shoppingFacade.getStores()).map((store) => store.name)).toEqual([
        'Aldi',
        'Lidl',
      ]);
    });
    const rows = within(screen.getByRole('list', { name: 'Stores' })).getAllByRole('listitem');
    expect(rows.map((row) => within(row).getByRole('link').textContent)).toEqual(['Aldi', 'Lidl']);
  });
});
