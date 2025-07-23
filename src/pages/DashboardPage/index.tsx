import React, { useCallback, useState } from 'react';
import { Stack } from '@mui/material';
import useTimer from '@/hooks/useTimer';
import { profile, type Runner } from '@/services/healthCheckService';
import { Insight, appendSample, type Sample } from './Insight';

const UPDATE_INTERVAL = 15_000;

const DashboardPage: React.FC = () => {
  const [runners, setRunners] = useState<Runner[]>([]);
  const [history, setHistory] = useState<Sample[]>([]);

  const handleTimerTick = useCallback(() => {
    profile().then(result => {
      if (result.status === 'success') {
        setRunners(result.data.runners);
        setHistory((old) => appendSample(old, result.data.runners));
      }
    });
  }, []);

  useTimer({
    initialDelay: 0,
    interval: UPDATE_INTERVAL,
    callback: handleTimerTick
  });

  return (
    <Stack direction="row" spacing={2}>
      <Insight
        label="CPU"
        description="CPU utilization"
        unit="%"
        dataKey="cpuUtilization"
        current={runners}
        history={history}
      />
      <Insight
        label="Memory"
        description="Allocated working memory"
        unit="MB"
        round
        dataKey="memoryUsage"
        current={runners}
        history={history}
      />
      <Insight
        label="Threads"
        description="Number of active threads"
        round
        dataKey="threadCount"
        current={runners}
        history={history}
      />
    </Stack>
  );
};

DashboardPage.displayName = "DashboardPage";
export default DashboardPage;