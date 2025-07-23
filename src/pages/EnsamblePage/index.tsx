import React, { useCallback, useState } from "react";
import useTimer from "@/hooks/useTimer";
import { profile, type Runner } from "@/services/healthCheckService";
import ResourceUsageTable from "./ResourceUsageTable";

const UPDATE_INTERVAL = 15_000;

const EnsamblePage: React.FC = () => {
    const [runners, setRunners] = useState<Runner[]>([]);

    const handleTimerTick = useCallback(() => {
        profile().then((result) => {
            if (result.status === "success") {
                setRunners(result.data.runners);
            }
        });
    }, []);

    useTimer({
        initialDelay: 0,
        interval: UPDATE_INTERVAL,
        callback: handleTimerTick,
    });

    return <ResourceUsageTable data={runners} />;
};

EnsamblePage.displayName = "EnsamblePage";
export default EnsamblePage;
