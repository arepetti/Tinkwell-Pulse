import { useEffect, useRef } from "react";

export interface ITimerOptions {
    initialDelay?: number;
    interval: number;
    callback: () => void;
}

export function useTimer({
    initialDelay = 0,
    interval,
    callback,
}: ITimerOptions) {
    const intervalRef = useRef<number | null>(null);
    const timeoutRef = useRef<number | null>(null);

    // Workaround for Dev Mode with StrictMode post React 18
    const realInitialDelay = Math.max(50, initialDelay);

    useEffect(() => {
        if (realInitialDelay === 0) {
            callback(); // Call immediately if no initial delay
            intervalRef.current = window.setInterval(callback, interval);
        } else {
            timeoutRef.current = window.setTimeout(() => {
                callback(); // Call after initial delay
                intervalRef.current = window.setInterval(callback, interval); // Start interval after initial delay
            }, realInitialDelay);
        }

        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
            if (timeoutRef.current !== null) {
                clearTimeout(timeoutRef.current); // Use clearTimeout for setTimeout
            }
        };
    }, [initialDelay, interval, callback]);
}

export default useTimer;