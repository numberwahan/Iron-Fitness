import { buildGoogleCalendarUrl } from "../calendar";
import { ScheduleItem, WorkoutDay } from "../types";

const sampleDay: WorkoutDay = {
  id: "day-1",
  name: "Full Body 1",
  focus: "Full body strength",
  exercises: [],
  estimatedDurationMinutes: 45,
};

const sampleItem: ScheduleItem = {
  id: "schedule-1",
  workoutDayId: "day-1",
  startDateTime: new Date("2026-03-05T10:00:00Z").toISOString(),
  durationMinutes: 60,
};

describe("buildGoogleCalendarUrl", () => {
  it("creates a valid Google Calendar URL containing expected fields", () => {
    const url = buildGoogleCalendarUrl(sampleItem, sampleDay);
    expect(url).toContain("https://calendar.google.com/calendar/render");
    expect(url).toContain("action=TEMPLATE");
    expect(url).toContain("text=");
    expect(url).toContain("details=");
    expect(url).toContain("dates=");
  });
});

