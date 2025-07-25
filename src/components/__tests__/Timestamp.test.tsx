import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Timestamp from "../Timestamp";

describe("Timestamp", () => {
  it("renders the timestamp with correct datetime and title attributes", () => {
    const testDate = new Date("2024-07-26T10:00:00Z");
    render(<Timestamp value={testDate} />);

    const expectedFullDateStr = `${testDate.toLocaleDateString()} ${testDate.toLocaleTimeString()}`;
    const expectedDisplayTime = testDate.toLocaleTimeString();

    const timeElement = screen.getByRole("time");
    expect(timeElement).toBeInTheDocument();
    expect(timeElement).toHaveAttribute("datetime", testDate.toISOString());
    expect(timeElement).toHaveAttribute("aria-label", expectedFullDateStr);

    // Check if it displays only time if it's today, otherwise full date
    const today = new Date();
    if (testDate.toDateString() === today.toDateString()) {
      expect(timeElement).toHaveTextContent(expectedDisplayTime);
    } else {
      expect(timeElement).toHaveTextContent(expectedFullDateStr);
    }
  });

  it("renders empty string for null or undefined value", () => {
    const { container } = render(<Timestamp value={null} />);
    expect(container).toBeEmptyDOMElement();

    const { container: container2 } = render(<Timestamp value={undefined} />);
    expect(container2).toBeEmptyDOMElement();
  });

  it("renders empty string for new Date(0)", () => {
    const { container } = render(<Timestamp value={new Date(0)} />);
    expect(container).toBeEmptyDOMElement();
  });
});