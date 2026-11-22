import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { routes } from '@/app/router';
import { listenForInstallPrompt } from '@/pwa/install';
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

  it('groups the theme options in a fieldset named by its legend', () => {
    renderAt('/settings');
    expect(screen.getByRole('group', { name: 'Theme' })).toContainElement(
      screen.getByRole('radio', { name: 'Dark' }),
    );
  });

  it('goes back to the home page', async () => {
    const user = userEvent.setup();
    renderAt('/settings');
    await user.click(screen.getByRole('link', { name: 'Back' }));
    expect(await screen.findByText('No stores yet')).toBeInTheDocument();
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

  describe('sharing', () => {
    it('groups the address, QR code and install instructions in a fieldset', () => {
      renderAt('/settings');
      const group = screen.getByRole('group', { name: 'Sharing' });
      expect(
        within(group).getByText(new URL(import.meta.env.BASE_URL, window.location.origin).href),
      ).toBeVisible();
      expect(within(group).queryByRole('textbox')).not.toBeInTheDocument();
      expect(within(group).getByRole('img', { name: 'QR code of the app address' })).toBeVisible();
      expect(within(group).getByRole('heading', { name: 'Android (Chrome)' })).toBeVisible();
      expect(
        within(group).getByRole('heading', { name: 'iPhone and iPad (Safari)' }),
      ).toBeVisible();
    });

    it('copies the address to the clipboard', async () => {
      const user = userEvent.setup();
      renderAt('/settings');

      await user.click(screen.getByRole('button', { name: 'Copy' }));

      expect(await navigator.clipboard.readText()).toBe(
        new URL(import.meta.env.BASE_URL, window.location.origin).href,
      );
      expect(await screen.findByText('Address copied to the clipboard')).toBeInTheDocument();
    });

    it('offers the install button only once the browser allows installing', async () => {
      const user = userEvent.setup();
      listenForInstallPrompt();
      renderAt('/settings');
      expect(screen.queryByRole('button', { name: 'Install the app' })).not.toBeInTheDocument();

      const prompt = vi.fn(() => Promise.resolve());
      act(() => {
        window.dispatchEvent(Object.assign(new Event('beforeinstallprompt'), { prompt }));
      });
      await user.click(await screen.findByRole('button', { name: 'Install the app' }));

      expect(prompt).toHaveBeenCalledOnce();
      expect(screen.queryByRole('button', { name: 'Install the app' })).not.toBeInTheDocument();
    });
  });
});
