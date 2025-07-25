import { Tinkwell, callTinkwell } from "./api";

export type MeasureQuality = "POOR" | "ACCEPTABLE" | "GOOD";
export type ServiceStatus =
    | "UNDEFINED"
    | "UNKNOWN"
    | "SERVING"
    | "DEGRADED"
    | "CRASHED";

export type Runner = {
    readonly name: string;
    readonly quality: MeasureQuality;
    readonly status: ServiceStatus;
    readonly resources: {
        readonly cpuUtilization: number;
        readonly memoryUsage: number;
        readonly peakMemoryUsage: number;
        readonly threadCount: number;
        readonly handleCount: number;
    };
};

export type ProfileResponse = {
    readonly runners: Runner[];
};

export type AssessResponse = {
    readonly status: ServiceStatus;
    readonly statusQuality: MeasureQuality;
    readonly anomaly: boolean;
    readonly anomalyQuality: MeasureQuality;
};

export function profile() {
    return callTinkwell<ProfileResponse>(Tinkwell.watchdog.methods.list);
}

export function assess() {
    return callTinkwell<AssessResponse>(Tinkwell.watchdog.methods.assess);
}
