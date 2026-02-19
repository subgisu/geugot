import { useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface UseThrottleOptions {
  interval?: number;
  showWarning?: boolean;
  warningMessage?: string;
}

// Edge Case 6: 같은 날짜에 연속 2번 드롭 방지
// Edge Case 8: 빠른 연속 드래그 (더블 드래그) 방지
export function useThrottle(options: UseThrottleOptions = {}) {
  const {
    interval = 1000,
    showWarning = true,
    warningMessage = '너무 빠릅니다. 잠시 후 다시 시도해주세요',
  } = options;

  const lastExecutionRef = useRef<number>(0);
  const isProcessingRef = useRef<boolean>(false);

  const throttle = useCallback(
    <T extends (...args: any[]) => any>(fn: T) => {
      return (...args: Parameters<T>): ReturnType<T> | undefined => {
        const now = Date.now();
        const timeSinceLastExecution = now - lastExecutionRef.current;

        // 처리 중이면 차단
        if (isProcessingRef.current) {
          if (showWarning) {
            toast.warning('이전 작업 처리 중입니다', {
              description: '잠시만 기다려주세요',
            });
          }
          return undefined;
        }

        // 최소 간격 체크
        if (timeSinceLastExecution < interval) {
          if (showWarning) {
            toast.info(warningMessage, {
              description: `${Math.ceil((interval - timeSinceLastExecution) / 1000)}초 후 다시 시도하세요`,
            });
          }
          return undefined;
        }

        lastExecutionRef.current = now;
        return fn(...args);
      };
    },
    [interval, showWarning, warningMessage]
  );

  const throttleAsync = useCallback(
    <T extends (...args: any[]) => Promise<any>>(fn: T) => {
      return async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>> | undefined> => {
        const now = Date.now();
        const timeSinceLastExecution = now - lastExecutionRef.current;

        // 처리 중이면 차단
        if (isProcessingRef.current) {
          if (showWarning) {
            toast.warning('이전 작업 처리 중입니다', {
              description: '잠시만 기다려주세요',
            });
          }
          return undefined;
        }

        // 최소 간격 체크
        if (timeSinceLastExecution < interval) {
          if (showWarning) {
            toast.info(warningMessage);
          }
          return undefined;
        }

        lastExecutionRef.current = now;
        isProcessingRef.current = true;

        try {
          const result = await fn(...args);
          return result;
        } finally {
          isProcessingRef.current = false;
        }
      };
    },
    [interval, showWarning, warningMessage]
  );

  const reset = useCallback(() => {
    lastExecutionRef.current = 0;
    isProcessingRef.current = false;
  }, []);

  return {
    throttle,
    throttleAsync,
    reset,
    isProcessing: () => isProcessingRef.current,
  };
}
