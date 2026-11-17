import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { routes } from '@/app/router';
import { useSettings } from '@/stores/settings';

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return render(<RouterProvider router={router} />);
}

describe('Settings page', () => {
  beforeEach(() => {
    useSettings.getState().setTheme('system');
  });

  it('renders and shows the version', () => {
    renderAt('/settings');
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByText(/Version/)).toBeInTheDocument();
  });

  it('switches theme', async () => {
    const user = userEvent.setup();
    renderAt('/settings');
    await user.click(screen.getByRole('radio', { name: 'Dark' }));
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    await user.click(screen.getByRole('radio', { name: 'Light' }));
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('switches language', async () => {
    const user = userEvent.setup();
    renderAt('/settings');
    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByRole('option', { name: 'Italiano' }));
    expect(await screen.findByRole('heading', { name: 'Impostazioni' })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('it');
  });
});
