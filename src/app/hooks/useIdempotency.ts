import { useRef, useCallback } from 'react';

// Edge Case 29: API 타임아웃 후 중복 방지를 위한 Idempotency Key 관리
export function useIdempotency() {
  const pendingRequests = useRef<Map<string, Promise<any>>>(new Map());
  const completedRequests = useRef<Map<string, { result: any; timestamp: number }>>(new Map());

  // UUID 생성 (간단한 버전)
  const generateKey = useCallback(() => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // 중복 요청 체크 및 실행
  const executeOnce = useCallback(async <T,>(
    key: string,
    fn: () => Promise<T>,
    ttl: number = 60000 // 60초
  ): Promise<T> => {
    // 1. 이미 완료된 요청인지 확인
    const completed = completedRequests.current.get(key);
    if (completed) {
      const age = Date.now() - completed.timestamp;
      if (age < ttl) {
        console.log(`Using cached result for key: ${key}`);
        return completed.result;
      } else {
        // TTL 만료 - 캐시 제거
        completedRequests.current.delete(key);
      }
    }

    // 2. 현재 진행 중인 요청인지 확인
    const pending = pendingRequests.current.get(key);
    if (pending) {
      console.log(`Waiting for pending request: ${key}`);
      return pending;
    }

    // 3. 새로운 요청 실행
    const promise = fn();
    pendingRequests.current.set(key, promise);

    try {
      const result = await promise;
      
      // 성공 시 결과 캐싱
      completedRequests.current.set(key, {
        result,
        timestamp: Date.now(),
      });

      return result;
    } finally {
      // 요청 완료 - pending에서 제거
      pendingRequests.current.delete(key);
    }
  }, []);

  // 캐시 클리어
  const clearCache = useCallback(() => {
    completedRequests.current.clear();
    pendingRequests.current.clear();
  }, []);

  return {
    generateKey,
    executeOnce,
    clearCache,
  };
}
