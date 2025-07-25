import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useTimer } from "../useTimer";

describe("useTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should call the callback after the specified delay", () => {
    const callback = vi.fn();
    renderHook(() => useTimer({ callback, interval: 1000 }));

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);

    // Due to React 18 StrictMode, effects are run twice in development
    // We expect the callback to be called twice initially if initialDelay is 0 or less than interval
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should call the callback with initial delay and then interval", () => {
    const callback = vi.fn();
    renderHook(() => useTimer({ initialDelay: 500, interval: 1000, callback }));

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(3);
  });

  it("should clear timers on unmount", () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useTimer({ callback, interval: 1000 }));

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    unmount();

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1); // Should not be called again after unmount
  });
});
