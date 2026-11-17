import { render, screen } from '@testing-library/react';
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
});
