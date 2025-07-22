import { useEffect } from "react";

type ScrollPickerOptions<T> = {
  ref: React.RefObject<HTMLElement | null>;
  items: T[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  onChange?: (value: T) => void;
  mobileBreakpoint?: number;
  infiniteScroll?: boolean;
};

export function useScrollPicker<T>({
  ref,
  items,
  selectedIndex,
  setSelectedIndex,
  onChange,
  mobileBreakpoint = 768,
  infiniteScroll = true,
}: ScrollPickerOptions<T>) {
  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const isMobile = window.innerWidth < mobileBreakpoint;

    if (isMobile) {
      // Touch-події для мобільних пристроїв
      let startY = 0;
      let isDragging = false;

      const handleTouchStart = (e: TouchEvent) => {
        startY = e.touches[0].clientY;
        isDragging = true;
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging) return;
        e.preventDefault();
      };

      const handleTouchEnd = (e: TouchEvent) => {
        if (!isDragging) return;
        isDragging = false;

        const endY = e.changedTouches[0].clientY;
        const deltaY = startY - endY;
        const threshold = 30; // Мінімальна відстань для свайпу

        if (Math.abs(deltaY) < threshold) return;

        const direction = deltaY > 0 ? 1 : -1;
        let newIndex = selectedIndex + direction;

        if (infiniteScroll) {
          if (newIndex < 0) {
            newIndex = items.length - 1;
          } else if (newIndex >= items.length) {
            newIndex = 0;
          }
        } else {
          if (newIndex < 0 || newIndex >= items.length) return;
        }

        setSelectedIndex(newIndex);
        onChange?.(items[newIndex]);
      };

      element.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
      element.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      element.addEventListener("touchend", handleTouchEnd, { passive: false });

      return () => {
        element.removeEventListener("touchstart", handleTouchStart);
        element.removeEventListener("touchmove", handleTouchMove);
        element.removeEventListener("touchend", handleTouchEnd);
      };
    } else {
      // Wheel-події для десктопу
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        const direction = e.deltaY > 0 ? 1 : -1;
        let newIndex = selectedIndex + direction;

        if (infiniteScroll) {
          if (newIndex < 0) {
            newIndex = items.length - 1;
          } else if (newIndex >= items.length) {
            newIndex = 0;
          }
        } else {
          if (newIndex < 0 || newIndex >= items.length) return;
        }

        setSelectedIndex(newIndex);
        onChange?.(items[newIndex]);
      };

      element.addEventListener("wheel", handleWheel, { passive: false });
      return () => element.removeEventListener("wheel", handleWheel);
    }
  }, [
    ref,
    selectedIndex,
    items,
    setSelectedIndex,
    onChange,
    mobileBreakpoint,
    infiniteScroll,
  ]);
}
