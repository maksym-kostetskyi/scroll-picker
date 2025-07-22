import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./ScrollPicker.module.css";
import { getDateOptions } from "./utils/getDateOptions";
import { useScrollPicker } from "./hooks/useScrollPicker";

export function ScrollPicker() {
  const [searchParams] = useSearchParams();
  const queryToday = searchParams.get("today");
  const [selectedMonth, setSelectedMonth] = useState("Jul");
  const months = useMemo(
    () => [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    []
  );
  const currentMonth = queryToday?.split(".")[1];
  const currentYear = queryToday?.split(".")[2];
  const optionsAMPM = ["AM", "PM"];
  const optionsHours = Array.from({ length: 12 }, (_, i) => i + 1);
  const optionsMinutes = Array.from({ length: 12 }, (_, i) =>
    String(i * 5).padStart(2, "0")
  );
  const optionsDate = getDateOptions(
    +(currentYear ?? "2025"),
    +(currentMonth ?? "7")
  );

  const [dateIndex, setDateIndex] = useState(0);
  const [hourIndex, setHourIndex] = useState(4); // 5 hours
  const [minuteIndex, setMinuteIndex] = useState(0); // 00 minutes
  const [ampmIndex, setAMPMIndex] = useState(1); // PM

  const dateRef = useRef<HTMLDivElement>(null);
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const ampmRef = useRef<HTMLDivElement>(null);

  useScrollPicker({
    ref: dateRef,
    items: optionsDate,
    selectedIndex: dateIndex,
    setSelectedIndex: setDateIndex,
    onChange: () => {
      setSelectedMonth(months[+(currentMonth ?? "7") - 1]);
    },
    infiniteScroll: true,
  });

  useScrollPicker({
    ref: hourRef,
    items: optionsHours,
    selectedIndex: hourIndex,
    setSelectedIndex: setHourIndex,
    infiniteScroll: true,
  });

  useScrollPicker({
    ref: minuteRef,
    items: optionsMinutes,
    selectedIndex: minuteIndex,
    setSelectedIndex: setMinuteIndex,
    infiniteScroll: true,
  });

  useScrollPicker({
    ref: ampmRef,
    items: optionsAMPM,
    selectedIndex: ampmIndex,
    setSelectedIndex: setAMPMIndex,
    infiniteScroll: false, // AM/PM не має безкінечної прокрутки
  });

  useEffect(() => {
    if (currentMonth) {
      setSelectedMonth(months[parseInt(currentMonth) - 1]);
    }
  }, [currentMonth, months]);

  // Функція для створення масиву елементів з додатковими для візуального ефекту
  const createVisibleItems = <T,>(
    items: T[],
    selectedIndex: number,
    isInfinite: boolean = true
  ) => {
    if (!isInfinite) {
      return items.map((item, index) => ({
        item,
        index,
        isSelected: index === selectedIndex,
      }));
    }

    const visibleItems = [];
    const totalVisible = 7; // показуємо 7 елементів (3 вгорі, 1 вибраний, 3 внизу)
    const halfVisible = Math.floor(totalVisible / 2);

    for (let i = -halfVisible; i <= halfVisible; i++) {
      let itemIndex = selectedIndex + i;
      if (itemIndex < 0) {
        itemIndex = items.length + itemIndex;
      } else if (itemIndex >= items.length) {
        itemIndex = itemIndex - items.length;
      }

      visibleItems.push({
        item: items[itemIndex],
        index: itemIndex,
        isSelected: i === 0,
        position: i,
      });
    }

    return visibleItems;
  };

  return (
    <div className={styles.scrollPicker}>
      <div className={styles.column} ref={dateRef}>
        {createVisibleItems(optionsDate, dateIndex, true).map((item, idx) => (
          <div
            className={
              item.isSelected
                ? `${styles.optionLine} ${styles.optionLineSelected}`
                : `${styles.optionLine}`
            }
            key={`${item.index}-${idx}`}
          >
            {item.isSelected && <div>Today</div>}

            {!item.isSelected && (
              <>
                <div>{item.item.dayAlias}</div>
                <div>
                  {selectedMonth} {item.item.day}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className={styles.column} ref={hourRef}>
        {createVisibleItems(optionsHours, hourIndex, true).map((item, idx) => (
          <div
            className={
              item.isSelected
                ? `${styles.optionLine} ${styles.optionLineSelected}`
                : `${styles.optionLine}`
            }
            key={`${item.index}-${idx}`}
          >
            {item.item}
          </div>
        ))}
      </div>

      <div className={styles.column} ref={minuteRef}>
        {createVisibleItems(optionsMinutes, minuteIndex, true).map(
          (item, idx) => (
            <div
              className={
                item.isSelected
                  ? `${styles.optionLine} ${styles.optionLineSelected}`
                  : `${styles.optionLine}`
              }
              key={`${item.index}-${idx}`}
            >
              {item.item}
            </div>
          )
        )}
      </div>

      <div className={styles.column} ref={ampmRef}>
        {createVisibleItems(optionsAMPM, ampmIndex, false).map((item, idx) => (
          <div
            className={
              item.isSelected
                ? `${styles.optionLine} ${styles.optionLineSelected}`
                : `${styles.optionLine}`
            }
            key={`${item.index}-${idx}`}
          >
            {item.item}
          </div>
        ))}
      </div>
    </div>
  );
}
