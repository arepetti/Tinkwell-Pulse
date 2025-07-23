import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from './App';
import DefaultLayout from './layouts/DefaultLayout';
import DashboardPage from './pages/DashboardPage';
import EnsamblePage from './pages/EnsamblePage';
import MeasuresPage from './pages/MeasuresPage';
import EventsPage from './pages/EventsPage';

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: '/',
        Component: DefaultLayout,
        children: [
          {
            path: '',
            Component: DashboardPage,
          },
          {
            path: 'health',
            Component: EnsamblePage,
          },
          {
            path: 'measures',
            Component: MeasuresPage,
          },
          {
            path: 'events',
            Component: EventsPage,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);