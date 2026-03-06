import { ScheduleItem, WorkoutDay } from "./types";

const pad = (value: number): string => (value < 10 ? `0${value}` : `${value}`);

const toGoogleDateTime = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
};

export const buildGoogleCalendarUrl = (
  item: ScheduleItem,
  day: WorkoutDay,
): string => {
  const start = new Date(item.startDateTime);
  const end = new Date(start.getTime() + item.durationMinutes * 60 * 1000);

  const startStr = toGoogleDateTime(start);
  const endStr = toGoogleDateTime(end);

  const text = encodeURIComponent(day.name);
  const details = encodeURIComponent(
    `Focus: ${day.focus}\n\nExercises:\n${day.exercises
      .slice(0, 6)
      .map((ex) => `• ${ex.exerciseSlug}`)
      .join("\n")}`,
  );

  const dates = `${startStr}/${endStr}`;

  const byDay = item.dayOfWeekCode ?? ["SU", "MO", "TU", "WE", "TH", "FR", "SA"][start.getUTCDay()];
  const recurRule = encodeURIComponent(`RRULE:FREQ=WEEKLY;BYDAY=${byDay}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&dates=${dates}&recur=${recurRule}`;
};

