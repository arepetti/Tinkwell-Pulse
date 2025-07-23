import { useEffect, useRef } from 'react';

export interface ITimerOptions {
  initialDelay?: number;
  interval: number;
  callback: () => void;
}

export function useTimer({ initialDelay = 0, interval, callback }: ITimerOptions) {
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (initialDelay >= interval || initialDelay < 0) {
      intervalRef.current = window.setInterval(callback, interval);
    } else {
      if (initialDelay === 0) {
        callback();
      } else {
       timeoutRef.current = window.setTimeout(callback, initialDelay);
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