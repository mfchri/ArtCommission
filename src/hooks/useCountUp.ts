import { useState, useEffect, useRef } from 'react';

/**
 * Animated count-up hook for stats counter
 */
export function useCountUp(target: number, durationMs: number = 1600, shouldStart: boolean = false): number {
  const [count, setCount] = useState<number>(0);
  const hasAnimatedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!shouldStart || hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    const startTime = performance.now();
    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      
      // Smooth cubic easeOut
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * target);
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(frame);
  }, [target, durationMs, shouldStart]);

  return count;
}
