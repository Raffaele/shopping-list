import { createHashRouter } from 'react-router';
import { Home } from '@/pages/Home/Home';
import { NotFound } from '@/pages/NotFound/NotFound';
import { Settings } from '@/pages/Settings/Settings';
import { Layout } from './Layout';

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'settings', element: <Settings /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];

export const createAppRouter = () => createHashRouter(routes);
export const router = createAppRouter();
