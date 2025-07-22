import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./ScrollPicker.module.css";
import { getDateOptions } from "./utils/getDateOptions";

export function ScrollPicker() {
  const [searchParams] = useSearchParams();
  const queryToday = searchParams.get("today");
  const [selectedMonth, setSelectedMonth] = useState("Jan");
  const [selectedDay, setSelectedDay] = useState(1);
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
  const currentDay = queryToday?.split(".")[0];
  const currentMonth = queryToday?.split(".")[1];
  const currentYear = queryToday?.split(".")[2];
  const optionsAMPM = ["AM", "PM"];
  const optionsHours = Array.from({ length: 12 }, (_, i) => i + 1);
  const optionsMinutes = Array.from({ length: 12 }, (_, i) => i * 5);
  const optionsDate = getDateOptions(
    +(currentYear ?? "1970"),
    +(currentMonth ?? "1")
  );
  const [selectedHour, setSelectedHour] = useState(1);
  const [selectedMinute, setselectedMinute] = useState(5);
  const [selectedAMPM, setselectedAMPM] = useState("AM");

  const [dateIndex, setDateIndex] = useState(0);
  const [hourIndex, setHourIndex] = useState(0);
  const [minuteIndex, setMinuteIndex] = useState(0);
  const [ampmIndex, setAMPMIndex] = useState(0);

  useEffect(() => {
    if (currentDay) {
      setSelectedDay(+currentDay);
    }

    if (currentMonth) {
      setSelectedMonth(months[parseInt(currentMonth) - 1]);
    }
  }, [currentDay, currentMonth, currentYear, months]);

  return (
    <div className={styles.scrollPicker}>
      <div className={styles.column}>
        {optionsDate.map((option) => (
          <div
            className={
              option.day === selectedDay
                ? `${styles.optionLine} ${styles.optionLineSelected}`
                : `${styles.optionLine}`
            }
            key={option.day}
          >
            {option.day === selectedDay && <div>Today</div>}

            {option.day !== selectedDay && (
              <>
                <div>{option.dayAlias}</div>
                <div>{selectedMonth}</div>
                <div>{option.day}</div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className={styles.column}>
        {optionsHours.map((option) => (
          <div
            className={
              option === selectedHour
                ? `${styles.optionLine} ${styles.optionLineSelected}`
                : `${styles.optionLine}`
            }
          >
            {option}
          </div>
        ))}
      </div>
      <div className={styles.column}>
        {optionsMinutes.map((option) => (
          <div
            className={
              option === selectedMinute
                ? `${styles.optionLine} ${styles.optionLineSelected}`
                : `${styles.optionLine}`
            }
          >
            {option}
          </div>
        ))}
      </div>
      <div className={styles.column}>
        {optionsAMPM.map((option) => (
          <div
            className={
              option === selectedAMPM
                ? `${styles.optionLine} ${styles.optionLineSelected}`
                : `${styles.optionLine}`
            }
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
}
