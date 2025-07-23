import DashboardIcon from '@mui/icons-material/DashboardOutlined';
import HealthIcon from '@mui/icons-material/MonitorHeartOutlined';
import MeasuresIcon from '@mui/icons-material/TableChartOutlined';
import EventsIcon from '@mui/icons-material/LabelOutlined';
import { Outlet } from 'react-router';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import type { Branding, Navigation } from '@toolpad/core/AppProvider';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Ensamble',
  },
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'health',
    title: 'Health',
    icon: <HealthIcon />,
  },
  {
    segment: 'measures',
    title: 'Measures',
    icon: <MeasuresIcon />,
  },
  {
    segment: 'events',
    title: 'Events',
    icon: <EventsIcon />,
  },
];

const BRANDING: Branding = {
  title: 'Tinkwell Pulse',
};

export default function App() {
  return (
    <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING}>
      <Outlet />
    </ReactRouterAppProvider>
  );
}