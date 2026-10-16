import { createBrowserRouter } from 'react-router';
import { AppLayout } from '../components/layout/AppLayout';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { paths } from './paths';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: paths.home, element: <HomePage /> },
      {
        path: paths.users,
        // Loaded on demand so the landing page bundle stays small.
        lazy: async () => {
          const { UsersPage } = await import('../pages/UsersPage');
          return { Component: UsersPage };
        },
      },
      {
        path: paths.documents,
        lazy: async () => {
          const { DocumentsPage } = await import('../pages/DocumentsPage');
          return { Component: DocumentsPage };
        },
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
