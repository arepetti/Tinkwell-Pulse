import type { PropsWithChildren } from "react";
import { styled } from "@mui/material";
import { PieChart, useDrawingArea } from "@mui/x-charts";

export interface IResourceUsageChart {
    title: string;
    data: { id: string; value: number; label: string }[];
}

const ChartLabelText = styled("text")(({ theme }) => ({
    fill: theme.palette.text.primary,
    textAnchor: "middle",
    dominantBaseline: "central",
    fontSize: 20,
}));

ChartLabelText.displayName = "ChartLabelText";

const ChartLabel: React.FC<PropsWithChildren> = ({ children }) => {
    const { width, height, left, top } = useDrawingArea();
    return (
        <ChartLabelText x={left + width / 2} y={top + height / 2}>
            {children}
        </ChartLabelText>
    );
};

ChartLabel.displayName = "ChartLabel";

const ResourceUsageChart: React.FC<IResourceUsageChart> = ({ title, data }) => (
    <PieChart
        series={[
            {
                paddingAngle: 3,
                innerRadius: 50,
                outerRadius: 70,
                data,
            },
        ]}
        width={200}
        height={150}
        hideLegend
    >
        <ChartLabel>{data.length === 0 ? "" : title}</ChartLabel>
    </PieChart>
);

ResourceUsageChart.displayName = "ResourceUsageChart";
export default ResourceUsageChart;
