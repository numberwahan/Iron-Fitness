"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buildGoogleCalendarUrl } from "../../lib/calendar";
import { ScheduleItem, WeeklyPlan, WorkoutDay } from "../../lib/types";

const STORAGE_KEY = "fitness-weekly-plan";

const loadPlan = (): WeeklyPlan | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as WeeklyPlan;
  } catch {
    return null;
  }
};

interface ScheduleDraft {
  dayOfWeek: string; // "0" (Sunday) - "6" (Saturday)
  time: string;      // "HH:mm" from type="time"
  durationMinutes: string;
}

export default function SchedulePage() {
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  const [drafts, setDrafts] = useState<Record<string, ScheduleDraft>>({});

  useEffect(() => {
    const loaded = loadPlan();
    setPlan(loaded);
    if (loaded) {
      const initial: Record<string, ScheduleDraft> = {};
      loaded.days.forEach((day) => {
        initial[day.id] = {
          dayOfWeek: "",
          time: "",
          durationMinutes: String(day.estimatedDurationMinutes || 45),
        };
      });
      setDrafts(initial);
    }
  }, []);

  if (!plan) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-50">
        <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-4 px-4 text-center">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            No plan to schedule
          </h1>
          <p className="max-w-md text-sm text-zinc-400 sm:text-base">
            Create your weekly workout plan first, then you&apos;ll be able to
            send each session to Google Calendar.
          </p>
          <Link
            href="/onboarding"
            className="mt-2 rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-300"
          >
            Create your plan
          </Link>
        </main>
      </div>
    );
  }

  const handleDraftChange = (
    dayId: string,
    field: keyof ScheduleDraft,
    value: string,
  ) => {
    setDrafts((prev) => ({
      ...prev,
      [dayId]: {
        ...(prev[dayId] || {
          dayOfWeek: "",
          time: "",
          durationMinutes: "45",
        }),
        [field]: value,
      },
    }));
  };

  const buildScheduleItem = (day: WorkoutDay): ScheduleItem | null => {
    const draft = drafts[day.id];
    if (!draft || !draft.dayOfWeek || !draft.time) return null;
    const duration = Number(draft.durationMinutes);
    if (Number.isNaN(duration) || duration <= 0) return null;

    const targetDow = Number(draft.dayOfWeek);
    if (Number.isNaN(targetDow) || targetDow < 0 || targetDow > 6) return null;

    const [hours, minutes] = draft.time.split(":").map((v) => Number(v));
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;

    const now = new Date();
    const startDateTime = new Date(now);
    const currentDow = startDateTime.getDay();
    let delta = (targetDow - currentDow + 7) % 7;
    if (delta < 0) delta += 7;
    startDateTime.setDate(startDateTime.getDate() + delta);
    startDateTime.setHours(hours, minutes, 0, 0);
    if (Number.isNaN(startDateTime.getTime())) return null;

    const dayOfWeekCode = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"][targetDow];

    return {
      id: `schedule-${day.id}`,
      workoutDayId: day.id,
      startDateTime: startDateTime.toISOString(),
      durationMinutes: duration,
      dayOfWeekCode,
    };
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
            Schedule workouts
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Send your training week to Google Calendar
          </h1>
          <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">
            Choose a day of the week and time for each workout. We&apos;ll
            create weekly repeating events in Google Calendar at those times.
          </p>
        </header>

        <section className="space-y-4">
          {plan.days.map((day) => {
            const draft = drafts[day.id];
            const scheduleItem = buildScheduleItem(day);

            return (
              <article
                key={day.id}
                className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5"
              >
                <header className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <h2 className="text-base font-semibold text-zinc-50 sm:text-lg">
                      {day.name}
                    </h2>
                    <p className="text-xs text-zinc-400 sm:text-sm">
                      {day.focus}
                    </p>
                  </div>
                  <p className="text-xs text-zinc-400 sm:text-sm">
                    ~{day.estimatedDurationMinutes} min in plan
                  </p>
                </header>

                <div className="grid gap-3 text-sm sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.5fr)]">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300">
                      Day of week
                    </label>
                    <select
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs outline-none ring-emerald-500/60 focus:ring sm:text-sm"
                      value={draft?.dayOfWeek ?? ""}
                      onChange={(e) =>
                        handleDraftChange(day.id, "dayOfWeek", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="1">Monday</option>
                      <option value="2">Tuesday</option>
                      <option value="3">Wednesday</option>
                      <option value="4">Thursday</option>
                      <option value="5">Friday</option>
                      <option value="6">Saturday</option>
                      <option value="0">Sunday</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300">
                      Start time
                    </label>
                    <input
                      type="time"
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs outline-none ring-emerald-500/60 focus:ring sm:text-sm"
                      value={draft?.time ?? ""}
                      onChange={(e) =>
                        handleDraftChange(day.id, "time", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300">
                      Duration (min)
                    </label>
                    <input
                      type="number"
                      min={15}
                      max={180}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs outline-none ring-emerald-500/60 focus:ring sm:text-sm"
                      value={draft?.durationMinutes ?? ""}
                      onChange={(e) =>
                        handleDraftChange(
                          day.id,
                          "durationMinutes",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <p className="text-xs text-zinc-400 sm:text-sm">
                    Once day, time, and duration are set, use the button to open
                    a pre-filled weekly event in Google Calendar.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={!draft?.dayOfWeek || !draft.time}
                      onClick={() => {
                        if (!plan) return;
                        const schedulesKey = "fitness-schedule";
                        const existingRaw =
                          window.localStorage.getItem(schedulesKey);
                        const existing: ScheduleItem[] = existingRaw
                          ? JSON.parse(existingRaw)
                          : [];
                        const item = buildScheduleItem(day);
                        if (!item) return;
                        const updated = [
                          ...existing.filter(
                            (s) => s.workoutDayId !== day.id,
                          ),
                          item,
                        ];
                        window.localStorage.setItem(
                          schedulesKey,
                          JSON.stringify(updated),
                        );
                      }}
                      className="rounded-full border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
                    >
                      Save locally
                    </button>
                    {scheduleItem && (
                      <a
                        href={buildGoogleCalendarUrl(scheduleItem, day)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-emerald-400 px-3 py-1.5 text-xs font-semibold text-emerald-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-300 sm:text-sm"
                      >
                        Add to Google Calendar
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <div className="mt-4">
          <Link
            href="/plan"
            className="inline-flex items-center rounded-full border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-900"
          >
            ← Back to plan
          </Link>
        </div>
      </main>
    </div>
  );
}
