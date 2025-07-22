import { useEffect } from "react";

type ScrollPickerOptions<T> = {
  ref: React.RefObject<HTMLElement | null>;
  items: T[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  onChange?: (value: T) => void;
  mobileBreakpoint?: number;
};

export function useScrollPicker<T>({
  ref,
  items,
  selectedIndex,
  setSelectedIndex,
  onChange,
  mobileBreakpoint = 768,
}: ScrollPickerOptions<T>) {
  useEffect(() => {
    const isMobile = window.innerWidth < mobileBreakpoint;
    if (isMobile || !ref.current) return;

    const element = ref.current;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const direction = e.deltaY > 0 ? 1 : -1;
      const newIndex = selectedIndex + direction;

      if (newIndex < 0 || newIndex >= items.length) return;

      setSelectedIndex(newIndex);
      onChange?.(items[newIndex]);
    };

    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => element.removeEventListener("wheel", handleWheel);
  }, [ref, selectedIndex, items, setSelectedIndex, onChange, mobileBreakpoint]);
}
