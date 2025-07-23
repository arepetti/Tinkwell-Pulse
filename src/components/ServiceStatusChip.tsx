import { Chip } from "@mui/material";
import type { MeasureQuality, ServiceStatus } from "@/services/healthCheckService";

export interface IServiceStatusChipProps {
  status?: ServiceStatus | null;
  quality?: MeasureQuality | null;
}

export const ServiceStatusChip: React.FC<IServiceStatusChipProps> = ({ status, quality }) => {
    let displayStatus = status ?? "UNDEFINED";
    if (displayStatus === "UNDEFINED" && ["ACCEPTABLE", "GOOD"].includes(quality ?? "POOR"))
        displayStatus = "SERVING";

    return (
        <Chip
            label={statusLabel[displayStatus]}
            variant={statusVariant[displayStatus]}
            color={statusColor[displayStatus]}
        />
    );
};

ServiceStatusChip.displayName = "ServiceStatusChip";
export default ServiceStatusChip;

const statusVariant: Record<ServiceStatus, React.ComponentProps<typeof Chip>["variant"]> = {
  'UNDEFINED': "outlined",
  'UNKNOWN': "outlined",
  'SERVING': "outlined",
  'DEGRADED': "filled",
  'CRASHED':  "filled",
}

const statusColor: Record<ServiceStatus, React.ComponentProps<typeof Chip>["color"]> = {
  'UNDEFINED': "default",
  'UNKNOWN': "default",
  'SERVING': "success",
  'DEGRADED': "warning",
  'CRASHED':  "error",
}

const statusLabel: Record<ServiceStatus, string> = {
  'UNDEFINED': "Unknown",
  'UNKNOWN': "Unknown",
  'SERVING': "Serving",
  'DEGRADED': "Degraded",
  'CRASHED': "Crashed",
}