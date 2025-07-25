import React, { useCallback, useState } from "react";
import useTimer from "@/hooks/useTimer";
import { find, type Measure } from "@/services/storeService";
import MeasureList from "./MeasureList";

const UPDATE_INTERVAL = 30_000;

export const MeasuresPage: React.FC = () => {
    const [measures, setMeasures] = useState<Measure[]>([]);

    const handleTimerTick = useCallback(() => {
        find().then((result) => {
            if (result.status === "success") {
                setMeasures(result.data);
            }
        });
    }, []);

    useTimer({
        initialDelay: 0,
        interval: UPDATE_INTERVAL,
        callback: handleTimerTick,
    });

    return <MeasureList data={measures} />;
};

MeasuresPage.displayName = "MeasuresPage";
export default MeasuresPage;
