import { getDaysInMonth } from "./getDaysInMonth";
import { zellerCongruence } from "./zellerCongruence";

export function getDateOptions(year: number, month: number) {
  const daysInMonth = getDaysInMonth(year, month);

  const options = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dayAlias = zellerCongruence(day, month, year);
    options.push({ day, dayAlias });
  }

  return options;
}
