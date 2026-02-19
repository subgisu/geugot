import { useEffect, useRef, useState } from 'react';

interface UseDragEdgeCasesOptions {
  onCancel?: () => void;
  onAutoScroll?: (direction: 'up' | 'down') => void;
  enabled?: boolean;
}

export function useDragEdgeCases(options: UseDragEdgeCasesOptions = {}) {
  const { onCancel, onAutoScroll, enabled = true } = options;
  const [isDragging, setIsDragging] = useState(false);
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Edge Case 1: 드래그 중 브라우저 창 리사이즈
    const handleResize = () => {
      if (isDragging) {
        console.log('Window resized during drag - canceling');
        onCancel?.();
        setIsDragging(false);
      }
    };

    // Edge Case 3: 드래그 중 탭 전환 (Alt+Tab)
    const handleVisibilityChange = () => {
      if (document.hidden && isDragging) {
        console.log('Tab switched during drag - canceling');
        onCancel?.();
        setIsDragging(false);
      }
    };

    // Edge Case 5: 드래그 중 Esc 키 누름
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDragging) {
        console.log('Escape pressed during drag - canceling');
        onCancel?.();
        setIsDragging(false);
      }
    };

    // Edge Case 4: 드래그 중 자동 스크롤
    const handleDragOver = (e: DragEvent) => {
      if (!isDragging) return;

      const SCROLL_ZONE = 50;
      const viewportHeight = window.innerHeight;
      const mouseY = e.clientY;

      // Clear existing scroll interval
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }

      if (mouseY < SCROLL_ZONE) {
        // Near top - scroll up
        scrollIntervalRef.current = setInterval(() => {
          window.scrollBy({ top: -10, behavior: 'smooth' });
          onAutoScroll?.('up');
        }, 50);
      } else if (mouseY > viewportHeight - SCROLL_ZONE) {
        // Near bottom - scroll down
        scrollIntervalRef.current = setInterval(() => {
          window.scrollBy({ top: 10, behavior: 'smooth' });
          onAutoScroll?.('down');
        }, 50);
      }
    };

    const handleDragEnd = () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    };

    // Edge Case 9: 드래그 중 마우스 배터리 방전 감지 (5초 무응답)
    const handleDrag = () => {
      if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current);
      }

      dragTimeoutRef.current = setTimeout(() => {
        if (isDragging) {
          console.log('No drag movement detected for 5 seconds - canceling');
          onCancel?.();
          setIsDragging(false);
        }
      }, 5000);
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('dragend', handleDragEnd);
    document.addEventListener('drag', handleDrag);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('dragend', handleDragEnd);
      document.removeEventListener('drag', handleDrag);
      
      if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current);
      }
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [isDragging, enabled, onCancel, onAutoScroll]);

  return {
    isDragging,
    setIsDragging,
  };
}
