import React, { useCallback, useEffect, useState } from "react";
import { Stack } from "@mui/material";
import useTimer from "@/hooks/useTimer";
import { profile, type Runner } from "@/services/healthCheckService";
import { Insight, HISTORY_LENGTH, type Sample } from "./Insight";

const UPDATE_INTERVAL = 15_000;

const DashboardPage: React.FC = () => {
    const [runners, setRunners] = useState<Runner[]>([]);
    const [history, setHistory] = useState<Sample[]>([]);

    const handleTimerTick = useCallback(() => {
        profile().then((result) => {
            if (result.status === "success") {
                setRunners(result.data.runners);
                setHistory((old) => appendSample(old, result.data.runners));
            }
        });
    }, []);

    useTimer({
        initialDelay: 0,
        interval: UPDATE_INTERVAL,
        callback: handleTimerTick,
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

function appendSample(history: Sample[], runners: Runner[]) {
    let newHistory = enforceLength([...history, createSample()]);
    newHistory.forEach((item, index) => {
        if (item !== null) item.id = index;
    });
    return newHistory;

    function enforceLength(array: Sample[]) {
        return array
            .slice(-HISTORY_LENGTH)
            .concat(
                Array(Math.max(HISTORY_LENGTH - array.length, 0)).fill(null),
            );
    }

    function createSample(): Sample {
        return runners.reduce(
            (acc, item) => {
                acc.cpuUtilization += item.resources.cpuUtilization;
                acc.memoryUsage += item.resources.memoryUsage;
                acc.peakMemoryUsage += item.resources.peakMemoryUsage;
                acc.threadCount += item.resources.threadCount;
                acc.handleCount += item.resources.handleCount;
                return acc;
            },
            {
                id: 0,
                cpuUtilization: 0,
                memoryUsage: 0,
                peakMemoryUsage: 0,
                threadCount: 0,
                handleCount: 0,
            },
        );
    }
}
