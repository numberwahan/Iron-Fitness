"use client";

import { useEffect, useState } from "react";

const SIGNUP_KEY = "fitness-signup-date";
const NOTES_KEY = "iron-fitness-notes";

const getDaysBetween = (start: Date, end: Date): number => {
  const msPerDay = 1000 * 60 * 60 * 24;
  const startMid = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endMid = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  const diff = endMid.getTime() - startMid.getTime();
  return Math.max(1, Math.floor(diff / msPerDay) + 1);
};

export default function ProfilePage() {
  const [signupDate, setSignupDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const rawSignup = window.localStorage.getItem(SIGNUP_KEY);
    if (rawSignup) {
      const parsed = new Date(rawSignup);
      if (!Number.isNaN(parsed.getTime())) {
        setSignupDate(parsed);
      }
    }
    const rawNotes = window.localStorage.getItem(NOTES_KEY);
    if (rawNotes) {
      setNotes(rawNotes);
    }
  }, []);

  const daysSignedUp =
    signupDate != null ? getDaysBetween(signupDate, new Date()) : null;

  const handleNotesChange = (value: string) => {
    setNotes(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(NOTES_KEY, value);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
            Iron Fitness
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Your profile & training notes
          </h1>
          <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">
            Keep track of how long you&apos;ve been training and jot down quick
            notes about your progress, wins, and adjustments.
          </p>
        </header>

        <section className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-zinc-100 sm:text-base">
            Days signed up
          </h2>
          {daysSignedUp ? (
            <p className="text-3xl font-semibold text-emerald-400">
              {daysSignedUp}
              <span className="ml-2 text-sm font-normal text-zinc-300">
                day{daysSignedUp === 1 ? "" : "s"} with Iron Fitness
              </span>
            </p>
          ) : (
            <p className="text-sm text-zinc-400">
              We&apos;ll start counting from the first time you generate a
              workout plan.
            </p>
          )}
        </section>

        <section className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-zinc-100 sm:text-base">
              Training notebook
            </h2>
            <p className="text-xs text-zinc-500">
              Saved locally in your browser.
            </p>
          </div>
          <textarea
            className="min-h-[200px] w-full resize-y rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50 outline-none ring-emerald-500/60 focus:ring sm:text-base"
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Write anything that helps you stay on track: how a session felt, weights used, PRs, sleep, stress, etc."
          />
        </section>
      </main>
    </div>
  );
}

