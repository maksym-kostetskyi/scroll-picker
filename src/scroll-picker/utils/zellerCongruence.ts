import type { DaysOfWeek } from "../types";

export function zellerCongruence(
  day: number,
  month: number,
  year: number
): DaysOfWeek | null {
  const daysOfWeek: DaysOfWeek[] = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  if (month === 1) {
    month = 13;
    year--;
  }
  if (month === 2) {
    month = 14;
    year--;
  }
  const q = day;
  const m = month;
  const k = year % 100;
  const j = Math.floor(year / 100);
  let h = Math.floor(
    q +
      Math.floor((13 * (m + 1)) / 5) +
      k +
      Math.floor(k / 4) +
      Math.floor(j / 4) +
      5 * j
  );
  h = h % 7;

  console.log(h);

  return daysOfWeek[h] ?? null;
}
