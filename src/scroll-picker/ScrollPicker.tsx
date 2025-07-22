import { useEffect, useState } from "react";
import type { DaysOfWeek } from "./types";
import { useSearchParams } from "react-router-dom";
import styles from "./ScrollPicker.module.css";
import { zellerCongruence } from "./utils/zellerCongruence";

export function ScrollPicker() {
  const [searchParams] = useSearchParams();
  const queryToday = searchParams.get("today");
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [dayOfTheWeek, setDayOfTheWeek] = useState<DaysOfWeek | null>(null);

  useEffect(() => {
    const currentDay = queryToday?.split(".")[0];
    const currentMonth = queryToday?.split(".")[1];
    const currentYear = queryToday?.split(".")[2];

    if (currentDay) {
      setDay(+currentDay);
    }

    if (currentMonth) {
      setMonth(+currentMonth);
    }

    if (currentDay && currentMonth && currentYear) {
      setDayOfTheWeek(
        zellerCongruence(+currentDay, +currentMonth, +currentYear)
      );
    }
  }, [queryToday]);

  useEffect(() => {
    console.log(day, month);
  }, [day, month]);

  return (
    <div className={styles.scrollPicker}>
      <div className={styles.day}>{day}</div>
      <div className={styles.dayOfTheWeek}>{dayOfTheWeek}</div>
      <div className={styles.month}>{month}</div>
    </div>
  );
}
