import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ServiceStatusChip from "../ServiceStatusChip";

vi.mock("@/services/healthCheckService", () => ({
  ServiceStatus: {
    UNDEFINED: "UNDEFINED",
    UNKNOWN: "UNKNOWN",
    SERVING: "SERVING",
    DEGRADED: "DEGRADED",
    CRASHED: "CRASHED",
  },
  MeasureQuality: {
    POOR: "POOR",
    ACCEPTABLE: "ACCEPTABLE",
    GOOD: "GOOD",
  },
}));

describe("ServiceStatusChip", () => {
  it("renders Serving status", () => {
    render(<ServiceStatusChip status="SERVING" />);
    expect(screen.getByText("Serving")).toBeInTheDocument();
  });

  it("renders Crashed status", () => {
    render(<ServiceStatusChip status="CRASHED" />);
    expect(screen.getByText("Crashed")).toBeInTheDocument();
  });

  it("renders Unknown status when status is undefined", () => {
    render(<ServiceStatusChip status={undefined} />);
    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });

  it("renders Unknown status when status is UNKNOWN", () => {
    render(<ServiceStatusChip status="UNKNOWN" />);
    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });

  it("renders Serving status when status is UNDEFINED but quality is ACCEPTABLE", () => {
    render(<ServiceStatusChip status={undefined} quality="ACCEPTABLE" />);
    expect(screen.getByText("Serving")).toBeInTheDocument();
  });

  it("renders Serving status when status is UNDEFINED but quality is GOOD", () => {
    render(<ServiceStatusChip status={undefined} quality="GOOD" />);
    expect(screen.getByText("Serving")).toBeInTheDocument();
  });

  it("renders Unknown status when status is UNDEFINED and quality is POOR", () => {
    render(<ServiceStatusChip status={undefined} quality="POOR" />);
    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });
});