import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./ScrollPicker.module.css";
import { getDateOptions } from "./utils/getDateOptions";
import { useScrollPicker } from "./hooks/useScrollPicker";

export function ScrollPicker() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryToday = searchParams.get("today");
  const queryTime = searchParams.get("time");

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

  // Парсинг query параметрів для дати
  const parseQueryDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    const parts = dateStr.split(".");
    if (parts.length !== 3) return null;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

    return { day, month, year };
  };

  // Парсинг query параметрів для часу (формат: 5:00PM або 17:00)
  const parseQueryTime = (timeStr: string | null) => {
    if (!timeStr) return null;

    // Парсинг формату з AM/PM (наприклад: 5:00PM)
    const ampmMatch = timeStr.match(/^(\d{1,2}):(\d{2})(AM|PM)$/i);
    if (ampmMatch) {
      const hour = parseInt(ampmMatch[1], 10);
      const minute = parseInt(ampmMatch[2], 10);
      const ampm = ampmMatch[3].toUpperCase();

      if (hour >= 1 && hour <= 12 && minute >= 0 && minute <= 59) {
        return { hour, minute, ampm };
      }
    }

    // Парсинг 24-годинного формату (наприклад: 17:00)
    const timeMatch = timeStr.match(/^(\d{1,2}):(\d{2})$/);
    if (timeMatch) {
      const hour24 = parseInt(timeMatch[1], 10);
      const minute = parseInt(timeMatch[2], 10);

      if (hour24 >= 0 && hour24 <= 23 && minute >= 0 && minute <= 59) {
        let hour = hour24;
        let ampm = "AM";

        if (hour24 === 0) {
          hour = 12;
        } else if (hour24 > 12) {
          hour = hour24 - 12;
          ampm = "PM";
        } else if (hour24 === 12) {
          ampm = "PM";
        }

        return { hour, minute, ampm };
      }
    }

    return null;
  };

  const parsedDate = parseQueryDate(queryToday);
  const parsedTime = parseQueryTime(queryTime);

  const currentDay = parsedDate?.day ?? new Date().getDate();
  const currentMonth = parsedDate?.month ?? new Date().getMonth() + 1;
  const currentYear = parsedDate?.year ?? new Date().getFullYear();

  // Початкові значення часу з query параметрів або за замовчуванням
  const defaultHour = parsedTime?.hour ?? 5;
  const defaultMinute = parsedTime?.minute ?? 0;
  const defaultAMPM = parsedTime?.ampm ?? "PM";

  const [selectedMonth, setSelectedMonth] = useState(months[currentMonth - 1]);

  const optionsAMPM = useMemo(() => ["AM", "PM"], []);
  const optionsHours = useMemo(
    () => Array.from({ length: 12 }, (_, i) => i + 1),
    []
  );
  const optionsMinutes = useMemo(
    () => Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0")),
    []
  );
  const optionsDate = getDateOptions(currentYear, currentMonth);

  // Знайти індекси для часу
  const findHourIndex = () => {
    return optionsHours.findIndex((hour) => hour === defaultHour);
  };

  const findMinuteIndex = () => {
    const minuteStr = String(defaultMinute).padStart(2, "0");
    return optionsMinutes.findIndex((minute) => minute === minuteStr);
  };

  const findAMPMIndex = () => {
    return optionsAMPM.findIndex((ampm) => ampm === defaultAMPM);
  };

  // Знайти індекс поточного дня в масиві дат
  const findDateIndex = () => {
    return optionsDate.findIndex((date) => date.day === currentDay);
  };

  const [dateIndex, setDateIndex] = useState(
    findDateIndex() >= 0 ? findDateIndex() : 0
  );
  const [hourIndex, setHourIndex] = useState(
    findHourIndex() >= 0 ? findHourIndex() : 4
  );
  const [minuteIndex, setMinuteIndex] = useState(
    findMinuteIndex() >= 0 ? findMinuteIndex() : 0
  );
  const [ampmIndex, setAMPMIndex] = useState(
    findAMPMIndex() >= 0 ? findAMPMIndex() : 1
  );

  const dateRef = useRef<HTMLDivElement>(null);
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const ampmRef = useRef<HTMLDivElement>(null);

  // Функція для оновлення URL з поточною датою та часом
  const updateURL = (
    newDateIndex?: number,
    newHourIndex?: number,
    newMinuteIndex?: number,
    newAMPMIndex?: number
  ) => {
    const dateIdx = newDateIndex ?? dateIndex;
    const hourIdx = newHourIndex ?? hourIndex;
    const minuteIdx = newMinuteIndex ?? minuteIndex;
    const ampmIdx = newAMPMIndex ?? ampmIndex;

    const selectedDate = optionsDate[dateIdx];
    const selectedHour = optionsHours[hourIdx];
    const selectedMinute = optionsMinutes[minuteIdx];
    const selectedAMPM = optionsAMPM[ampmIdx];

    if (selectedDate && selectedHour && selectedMinute && selectedAMPM) {
      const formattedDate = `${selectedDate.day
        .toString()
        .padStart(2, "0")}.${currentMonth
        .toString()
        .padStart(2, "0")}.${currentYear}`;

      const formattedTime = `${selectedHour}:${selectedMinute}${selectedAMPM}`;

      setSearchParams({
        today: formattedDate,
        time: formattedTime,
      });
    }
  };

  useScrollPicker({
    ref: dateRef,
    items: optionsDate,
    selectedIndex: dateIndex,
    setSelectedIndex: (newIndex) => {
      setDateIndex(newIndex);
      updateURL(newIndex);
    },
    onChange: () => {
      setSelectedMonth(months[currentMonth - 1]);
    },
    infiniteScroll: true,
  });

  useScrollPicker({
    ref: hourRef,
    items: optionsHours,
    selectedIndex: hourIndex,
    setSelectedIndex: (newIndex) => {
      setHourIndex(newIndex);
      updateURL(undefined, newIndex);
    },
    infiniteScroll: true,
  });

  useScrollPicker({
    ref: minuteRef,
    items: optionsMinutes,
    selectedIndex: minuteIndex,
    setSelectedIndex: (newIndex) => {
      setMinuteIndex(newIndex);
      updateURL(undefined, undefined, newIndex);
    },
    infiniteScroll: true,
  });

  useScrollPicker({
    ref: ampmRef,
    items: optionsAMPM,
    selectedIndex: ampmIndex,
    setSelectedIndex: (newIndex) => {
      setAMPMIndex(newIndex);
      updateURL(undefined, undefined, undefined, newIndex);
    },
    infiniteScroll: false, // AM/PM не має безкінечної прокрутки
  });

  useEffect(() => {
    setSelectedMonth(months[currentMonth - 1]);

    // Оновлюємо індекс дати при зміні query параметрів
    const newDateIndex = optionsDate.findIndex(
      (date) => date.day === currentDay
    );
    if (newDateIndex >= 0 && newDateIndex !== dateIndex) {
      setDateIndex(newDateIndex);
    }

    // Оновлюємо індекси часу при зміні query параметрів
    if (parsedTime) {
      const newHourIndex = optionsHours.findIndex(
        (hour) => hour === parsedTime.hour
      );
      const newMinuteIndex = optionsMinutes.findIndex(
        (minute) => minute === String(parsedTime.minute).padStart(2, "0")
      );
      const newAMPMIndex = optionsAMPM.findIndex(
        (ampm) => ampm === parsedTime.ampm
      );

      if (newHourIndex >= 0 && newHourIndex !== hourIndex) {
        setHourIndex(newHourIndex);
      }
      if (newMinuteIndex >= 0 && newMinuteIndex !== minuteIndex) {
        setMinuteIndex(newMinuteIndex);
      }
      if (newAMPMIndex >= 0 && newAMPMIndex !== ampmIndex) {
        setAMPMIndex(newAMPMIndex);
      }
    }
  }, [
    currentMonth,
    months,
    currentDay,
    optionsDate,
    dateIndex,
    parsedTime,
    optionsHours,
    optionsMinutes,
    optionsAMPM,
    hourIndex,
    minuteIndex,
    ampmIndex,
  ]);

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

  // Функція для обробки submit
  const handleSubmit = () => {
    const selectedDate = optionsDate[dateIndex];
    const selectedHour = optionsHours[hourIndex];
    const selectedMinute = optionsMinutes[minuteIndex];
    const selectedAMPM = optionsAMPM[ampmIndex];

    if (selectedDate && selectedHour && selectedMinute && selectedAMPM) {
      const formattedDate = `${selectedDate.day
        .toString()
        .padStart(2, "0")}.${currentMonth
        .toString()
        .padStart(2, "0")}.${currentYear}`;

      const formattedTime = `${selectedHour}:${selectedMinute}${selectedAMPM}`;

      console.log(
        "Date and time:",
        `${selectedDate.dayAlias} ${formattedDate} ${formattedTime}`
      );
    }
  };

  return (
    <>
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
          {createVisibleItems(optionsHours, hourIndex, true).map(
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
          {createVisibleItems(optionsAMPM, ampmIndex, false).map(
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
      </div>
      <button className={styles.submitButton} onClick={handleSubmit}>
        Submit
      </button>
    </>
  );
}
