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
        if (realInitialDelay >= interval || realInitialDelay < 0) {
            intervalRef.current = window.setInterval(callback, interval);
        } else {
            if (realInitialDelay === 0) {
                callback();
            } else {
                timeoutRef.current = window.setTimeout(callback, realInitialDelay);
            }
            intervalRef.current = window.setInterval(callback, interval);
        }

        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
            if (timeoutRef.current !== null) {
                clearInterval(timeoutRef.current);
            }
        };
    }, [initialDelay, interval, callback]);
}

export default useTimer;
