import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { routes } from './router';

describe('router', () => {
  it('renders NotFound for unknown routes', () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/nope/nothing'] });
    render(<RouterProvider router={router} />);
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to Home' })).toBeInTheDocument();
  });

  it('renders the stores list on index', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/'] });
    render(<RouterProvider router={router} />);
    expect(await screen.findByText('No stores yet')).toBeInTheDocument();
  });

  it('opens the settings from the header, which replaces the bottom navigation', async () => {
    const user = userEvent.setup();
    const router = createMemoryRouter(routes, { initialEntries: ['/'] });
    render(<RouterProvider router={router} />);

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    await user.click(await screen.findByRole('link', { name: 'Settings' }));
    expect(await screen.findByRole('heading', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Settings' })).not.toBeInTheDocument();
  });
});
