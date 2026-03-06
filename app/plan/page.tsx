"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getExerciseBySlug } from "../../lib/exercises";
import { Exercise, WeeklyPlan, WorkoutDay, WorkoutExercise } from "../../lib/types";

const STORAGE_KEY = "fitness-weekly-plan";

const formatPrescription = (prescription: WorkoutExercise["prescription"]) => {
  if (prescription.type === "reps") {
    return `${prescription.sets} sets × ${prescription.reps} reps`;
  }
  const seconds = prescription.seconds;
  if (seconds >= 60) {
    const mins = Math.round(seconds / 60);
    return `${prescription.sets} × ${mins} min`;
  }
  return `${prescription.sets} × ${seconds} sec`;
};

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

export default function PlanPage() {
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);

  useEffect(() => {
    setPlan(loadPlan());
  }, []);

  if (!plan) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-50">
        <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-4 px-4 text-center">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            No plan found
          </h1>
          <p className="max-w-md text-sm text-zinc-400 sm:text-base">
            Start by telling us about your body, goals, and equipment so we can
            build a weekly plan for you.
          </p>
          <Link
            href="/onboarding"
            className="mt-2 rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-300"
          >
            Create my plan
          </Link>
        </main>
      </div>
    );
  }

  const { profile, days } = plan;

  const goalLabelMap: Record<string, string> = {
    fat_loss: "Fat loss",
    muscle_gain: "Muscle gain",
    strength: "Strength",
    endurance: "Endurance",
    general_fitness: "General fitness",
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
            Your weekly plan
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {goalLabelMap[profile.goal] ?? "Training"} · {profile.daysPerWeek}{" "}
            days / week
          </h1>
          <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">
            Below you&apos;ll see each workout day with its focus. Every
            exercise shows the sets and reps or time right next to the name so
            you can follow along at a glance.
          </p>
        </header>

        <section className="flex flex-wrap gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-xs text-zinc-300 sm:text-sm">
          <div>
            <span className="font-medium text-zinc-50">Goal: </span>
            {goalLabelMap[profile.goal] ?? profile.goal}
          </div>
          <div>
            <span className="font-medium text-zinc-50">Experience: </span>
            {profile.experienceLevel}
          </div>
          <div>
            <span className="font-medium text-zinc-50">Days per week: </span>
            {profile.daysPerWeek}
          </div>
          {profile.sessionDurationMinutes && (
            <div>
              <span className="font-medium text-zinc-50">Target session: </span>
              ~{profile.sessionDurationMinutes} min
            </div>
          )}
        </section>

        <section className="space-y-4">
          {days.map((day) => (
            <DayCard key={day.id} day={day} />
          ))}
        </section>

        <section className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-zinc-400 sm:text-sm">
            Want to see everything laid out on your calendar?
          </div>
          <div className="flex gap-3">
            <Link
              href="/schedule"
              className="rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold text-emerald-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-300 sm:text-sm"
            >
              Schedule these workouts
            </Link>
            <Link
              href="/onboarding"
              className="rounded-full border border-zinc-700 px-4 py-2 text-xs font-medium text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-900 sm:text-sm"
            >
              Regenerate plan
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

interface DayCardProps {
  day: WorkoutDay;
}

function DayCard({ day }: DayCardProps) {
  return (
    <article className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-zinc-50 sm:text-lg">
            {day.name}
          </h2>
          <p className="text-xs text-zinc-400 sm:text-sm">{day.focus}</p>
        </div>
        <p className="text-xs text-zinc-400 sm:text-sm">
          ~{day.estimatedDurationMinutes} min
        </p>
      </header>
      <ul className="divide-y divide-zinc-800">
        {day.exercises.map((exercise) => {
          const exerciseMeta = getExerciseBySlug(exercise.exerciseSlug) as
            | Exercise
            | undefined;
          const prescriptionLabel = formatPrescription(exercise.prescription);

          return (
            <li
              key={exercise.exerciseSlug}
              className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <Link
                  href={`/exercise/${exercise.exerciseSlug}`}
                  className="text-sm font-semibold text-zinc-50 hover:text-emerald-400 sm:text-base"
                >
                  {exerciseMeta?.name ?? exercise.exerciseSlug} ·{" "}
                  <span className="font-normal text-emerald-300">
                    {prescriptionLabel}
                  </span>
                </Link>
                {exerciseMeta && (
                  <>
                    <p className="text-xs text-zinc-400 sm:text-sm">
                      {exerciseMeta.primaryMuscles.join(", ")} ·{" "}
                      {exerciseMeta.equipment === "bodyweight_only"
                        ? "Bodyweight"
                        : exerciseMeta.equipment === "dumbbells"
                        ? "Dumbbells"
                        : exerciseMeta.equipment === "barbell"
                        ? "Barbell"
                        : exerciseMeta.equipment === "machines"
                        ? "Machines"
                        : "Gym cardio"}
                    </p>
                    <p className="text-xs text-zinc-500 sm:text-xs">
                      {exerciseMeta.description}
                    </p>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

