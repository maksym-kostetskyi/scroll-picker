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
    const isMobile = window.innerWidth < mobileBreakpoint;
    if (isMobile || !ref.current) return;

    const element = ref.current;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const direction = e.deltaY > 0 ? 1 : -1;
      let newIndex = selectedIndex + direction;

      if (infiniteScroll) {
        // Безкінечна прокрутка
        if (newIndex < 0) {
          newIndex = items.length - 1;
        } else if (newIndex >= items.length) {
          newIndex = 0;
        }
      } else {
        // Обмежена прокрутка (для AM/PM)
        if (newIndex < 0 || newIndex >= items.length) return;
      }

      setSelectedIndex(newIndex);
      onChange?.(items[newIndex]);
    };

    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => element.removeEventListener("wheel", handleWheel);
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
