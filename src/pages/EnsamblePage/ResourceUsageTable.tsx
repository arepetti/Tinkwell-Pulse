import {
    Tooltip,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Avatar,
    styled,
    Container,
    type TableRowProps,
} from "@mui/material";
import RunnerServingIcon from "@mui/icons-material/DirectionsRunOutlined";
import RunnerDegradedIcon from "@mui/icons-material/DirectionsWalkOutlined";
import RunnerCrashedIcon from "@mui/icons-material/ArrowCircleDown";
import { amber, red, green } from "@mui/material/colors";
import {
    type MeasureQuality,
    type Runner,
    type ServiceStatus,
} from "@/services/healthCheckService";
import ServiceStatusChip from "@/components/ServiceStatusChip";

export interface IResourceUsageTableProps {
    data: Runner[];
}

export const ResourceUsageTable: React.FC<IResourceUsageTableProps> = ({ data }) => (
    <TableContainer component={Container}>
        <Table sx={{ minWidth: 650 }}>
            <TableHead>
                <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Runner</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Quality</TableCell>
                    <TableCell align="right">CPU&nbsp;(%)</TableCell>
                    <TableCell align="right">Memory&nbsp;(MB)</TableCell>
                    <TableCell align="right">Peak memory&nbsp;(MB)</TableCell>
                    <TableCell align="right">Threads</TableCell>
                    <TableCell align="right">Handles</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map((runner) => (
                    <StyledTableRow
                        key={runner.name}
                        dimmed={
                            !["GOOD", "ACCEPTABLE"].includes(runner.quality)
                        }
                    >
                        <TableCell>
                            <Tooltip title={runner.status}>
                                <Avatar
                                    sx={{
                                        bgcolor: statusColors[runner.status],
                                    }}
                                >
                                    {statusIcon[runner.status]}
                                </Avatar>
                            </Tooltip>
                        </TableCell>
                        <TableCell component="th" scope="row">
                            {runner.name}
                        </TableCell>
                        <TableCell>
                            <ServiceStatusChip
                                status={runner?.status}
                                quality={runner?.quality}
                            />
                        </TableCell>
                        <TableCell>{qualityLabel[runner.quality]}</TableCell>
                        <TableCell align="right">
                            {runner.resources.cpuUtilization <= 1
                                ? "<1"
                                : runner.resources.cpuUtilization}
                        </TableCell>
                        <TableCell align="right">
                            {runner.resources.memoryUsage}
                        </TableCell>
                        <TableCell align="right">
                            {runner.resources.peakMemoryUsage}
                        </TableCell>
                        <TableCell align="right">
                            {runner.resources.threadCount}
                        </TableCell>
                        <TableCell align="right">
                            {runner.resources.handleCount}
                        </TableCell>
                    </StyledTableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

ResourceUsageTable.displayName = "ResourceUsageTable";
export default ResourceUsageTable;

const statusColors: Record<ServiceStatus, string> = {
    UNDEFINED: green[300],
    UNKNOWN: green[300],
    SERVING: green[500],
    DEGRADED: amber[500],
    CRASHED: red[500],
};

const statusIcon: Record<ServiceStatus, React.ReactElement> = {
    UNDEFINED: <RunnerServingIcon />,
    UNKNOWN: <RunnerServingIcon />,
    SERVING: <RunnerServingIcon />,
    DEGRADED: <RunnerDegradedIcon />,
    CRASHED: <RunnerCrashedIcon />,
};

const qualityLabel: Record<MeasureQuality, string> = {
    POOR: "Poor",
    ACCEPTABLE: "Acceptable",
    GOOD: "Good",
};

interface IStyledTableRowProps {
    dimmed?: boolean;
}

const StyledTableRow = styled(TableRow, {
    shouldForwardProp: (prop) => prop !== "dimmed",
})<IStyledTableRowProps & TableRowProps>(({ theme, dimmed }) => ({
    "& td": {
        color: dimmed ? theme.palette.text.disabled : "inherit",
    },
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));
