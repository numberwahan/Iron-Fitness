"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { WeeklyPlan } from "../../lib/types";

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

const toFeetInches = (cm: number): { feet: number; inches: number } => {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches - feet * 12);
  return { feet, inches };
};

const toPounds = (kg: number): number => Math.round(kg / 0.45359237);

const calculateBmi = (kg: number, cm: number): number => {
  const meters = cm / 100;
  return kg / (meters * meters);
};

export default function MetricsPage() {
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);

  useEffect(() => {
    setPlan(loadPlan());
  }, []);

  if (!plan) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-50">
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-4 px-4 text-center">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            No current metrics yet
          </h1>
          <p className="max-w-md text-sm text-zinc-400 sm:text-base">
            Generate a training plan first so we can capture your current
            metrics and show them here.
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

  const { profile } = plan;
  const { feet, inches } = toFeetInches(profile.heightCm);
  const pounds = toPounds(profile.weightKg);
  const bmi = calculateBmi(profile.weightKg, profile.heightCm);

  const goalLabelMap: Record<string, string> = {
    fat_loss: "Fat loss",
    muscle_gain: "Muscle gain",
    strength: "Strength",
    endurance: "Endurance",
    general_fitness: "General fitness",
  };

  const equipmentLabelMap: Record<string, string> = {
    bodyweight_only: "Bodyweight only",
    dumbbells: "Dumbbells",
    barbell: "Barbell",
    machines: "Machines",
    full_gym: "Full gym",
  };

  const equipmentDisplay = profile.availableEquipment
    .map((eq) => equipmentLabelMap[eq] ?? eq)
    .join(", ");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
            Current metrics
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Your current training metrics
          </h1>
          <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">
            These numbers come from the most recent plan you generated and can
            help you track how your profile changes over time.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <p className="text-xs font-medium text-zinc-400">Height</p>
            <p className="text-lg font-semibold">
              {profile.heightCm} cm
              <span className="ml-1 text-xs text-zinc-400">
                ({feet}&apos;{inches}")
              </span>
            </p>
          </div>
          <div className="space-y-1 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <p className="text-xs font-medium text-zinc-400">Weight</p>
            <p className="text-lg font-semibold">
              {profile.weightKg} kg
              <span className="ml-1 text-xs text-zinc-400">({pounds} lb)</span>
            </p>
          </div>
          <div className="space-y-1 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <p className="text-xs font-medium text-zinc-400">BMI</p>
            <p className="text-lg font-semibold">{bmi.toFixed(1)}</p>
          </div>
        </section>

        <section className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-zinc-100 sm:text-base">
            Training profile
          </h2>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-zinc-400">Goal</dt>
              <dd className="font-medium">
                {goalLabelMap[profile.goal] ?? profile.goal}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-400">Experience level</dt>
              <dd className="font-medium">{profile.experienceLevel}</dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-400">Days per week</dt>
              <dd className="font-medium">{profile.daysPerWeek}</dd>
            </div>
            {profile.sessionDurationMinutes && (
              <div>
                <dt className="text-xs text-zinc-400">Session length</dt>
                <dd className="font-medium">
                  ~{profile.sessionDurationMinutes} minutes
                </dd>
              </div>
            )}
            {profile.gender && (
              <div>
                <dt className="text-xs text-zinc-400">Gender</dt>
                <dd className="font-medium">{profile.gender}</dd>
              </div>
            )}
            {profile.age && (
              <div>
                <dt className="text-xs text-zinc-400">Age</dt>
                <dd className="font-medium">{profile.age}</dd>
              </div>
            )}
            <div className="sm:col-span-2">
              <dt className="text-xs text-zinc-400">Equipment</dt>
              <dd className="font-medium">
                {profile.availableEquipment.length > 0
                  ? equipmentDisplay
                  : "Not specified"}
              </dd>
            </div>
          </dl>
        </section>

        <div>
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

