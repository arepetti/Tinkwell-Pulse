import React, { useCallback, useState } from 'react';
import { Outlet } from 'react-router';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer, PageHeader, PageHeaderToolbar } from '@toolpad/core/PageContainer';
import { Stack, Chip } from '@mui/material';
import useTimer from '@/hooks/useTimer';
import { type AssessResponse, assess } from '@/services/healthCheckService';
import ServiceStatusChip from '@/components/ServiceStatusChip';

interface IPropsWithAssessment {
  assessment: AssessResponse | null;
}

const CustomPageToolbar: React.FC<IPropsWithAssessment> = ({ assessment }) => (
  <PageHeaderToolbar>
    <Stack direction="row" spacing={2}>
      <ServiceStatusChip status={assessment?.status} quality={assessment?.statusQuality} />
      <Chip
        label={assessment?.anomaly ? "Anomaly" : "Normal"}
        variant={assessment?.anomaly ? "filled" : "outlined"}
        color={assessment?.anomaly ? "warning" : "default"}
      />
    </Stack>
  </PageHeaderToolbar>
);

CustomPageToolbar.displayName = "CustomPageToolbar";

const CustomPageHeader: React.FC<IPropsWithAssessment> = ({ assessment }) => {
  const CustomPageToolbarComponent = React.useCallback(
    () => <CustomPageToolbar assessment={assessment} />,
    [assessment],
  );

  return <PageHeader slots={{ toolbar: CustomPageToolbarComponent }} />;
}

CustomPageHeader.displayName = "CustomPageHeader";

const DefaultLayout: React.FC = () => {
  const [assessment, setAssessment] = useState<AssessResponse | null>(null);

  const CustomPageHeaderComponent = React.useCallback(
    () => <CustomPageHeader assessment={assessment} />,
    [assessment],
  );

  const handleTimerTick = useCallback(() => {
      assess().then(result => {
        setAssessment(result.data);
      });
  }, []);

  useTimer({
    initialDelay: 0,
    interval: 30_000,
    callback: handleTimerTick
  });

  return (
    <DashboardLayout>
      <PageContainer slots={{ header: CustomPageHeaderComponent }}>
        <Outlet />
      </PageContainer>
    </DashboardLayout>
  );
};

DefaultLayout.displayName = "DefaultLayout";
export default DefaultLayout;