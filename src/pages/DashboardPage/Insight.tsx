import React, { useMemo } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { type Runner } from "@/services/healthCheckService";
import ResourceUsageChart from "./ResourceUsageChart";
import { SparkLineChart } from "@mui/x-charts";

export const HISTORY_LENGTH = 64;

export type Sample = Runner["resources"] & { id: number };

export interface IInsightProps {
    label: string;
    description?: string;
    unit?: string;
    round?: boolean;
    dataKey: keyof Runner["resources"];
    current: Runner[];
    history: Sample[];
}

export const Insight: React.FC<IInsightProps> = ({
    label,
    description,
    unit,
    round,
    dataKey,
    current,
    history,
}) => {
    const trend = useMemo(
        () =>
            history.map((x) =>
                x === null ? 0 : round ? Math.round(x[dataKey]) : x[dataKey],
            ),
        [history, dataKey, round],
    );
    const data = useMemo(() => {
        return current.map((x) => ({
            id: x.name,
            value: Math.max(0.1, x.resources[dataKey]),
            label: x.name,
        }));
    }, [current, dataKey]);

    const sum = Math.round(data.reduce((acc, curr) => acc + curr.value, 0));
    const min = Math.floor(
        trend.reduce(
            (acc, curr) => (curr !== null && curr < acc! ? curr : acc),
            Number.MAX_VALUE,
        )! * 0.8,
    );
    const max = Math.ceil(
        trend.reduce(
            (acc, curr) => (curr !== null && curr > acc! ? curr : acc),
            Number.MIN_VALUE,
        )! * 1.1,
    );

    const value = unit === undefined ? `${sum}` : `${sum} ${unit}`;

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography
                    gutterBottom
                    sx={{ color: "text.secondary", fontSize: 14 }}
                >
                    {description}
                </Typography>
                <Typography variant="h5" component="div">
                    {label}
                </Typography>
                <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                    {unit ?? "#"}
                </Typography>
                <ResourceUsageChart title={value} data={data} />
                <SparkLineChart
                    curve="monotoneX"
                    showTooltip
                    color="cornflowerblue"
                    data={trend}
                    xAxis={{ min: 0, max: HISTORY_LENGTH }}
                    yAxis={{ min, max }}
                    width={300}
                    height={150}
                    sx={{ mt: 1.5 }}
                    valueFormatter={(n) => `${label}: ${n} ${unit ?? ""}`}
                />
            </CardContent>
        </Card>
    );
};

Insight.displayName = "Insight";
export default Insight;
