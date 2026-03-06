"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "fitness-weekly-plan";

export default function HomePage() {
  const [hasPlan, setHasPlan] = useState<boolean | null>(null);
  const { isSignedIn, isLoaded } = useAuth();
  const clerkEnabled =
    typeof process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === "string" &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.length > 0;
  const showSignInPrompt = clerkEnabled && isLoaded && !isSignedIn;

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      setHasPlan(!!raw && raw.length > 0);
    } catch {
      setHasPlan(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8">
        {showSignInPrompt && (
          <section
            className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-center text-sm text-amber-200 sm:text-base"
            role="status"
            aria-live="polite"
          >
            <strong>Sign in or create an account</strong> to access your plan,
            schedule, and profile. Links above will ask you to sign in when you
            click them.
          </section>
        )}
        {/* Hero with mission */}
        <section className="space-y-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-400">
            Welcome to Iron Fitness
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Our mission
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-zinc-300 sm:text-xl">
            Iron Fitness exists to make intelligent, personalized training accessible to everyone.
            We combine your body metrics, goals, and available equipment into a clear weekly plan—so you
            spend less time guessing and more time lifting. Whether you&apos;re at home with no gear or
            in a full gym, we help you build habits that stick and progress that lasts.
          </p>
        </section>

        {/* Accomplishments */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8">
          <h2 className="mb-6 text-center text-xl font-semibold text-zinc-100 sm:text-2xl">
            Why train with us
          </h2>
          <ul className="grid gap-4 text-sm text-zinc-300 sm:grid-cols-2 sm:gap-6 sm:text-base">
            <li className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-400" aria-hidden>✓</span>
              <span><strong className="text-zinc-100">500K+</strong> personalized plans generated</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-400" aria-hidden>✓</span>
              <span><strong className="text-zinc-100">#1</strong> rated fitness planner in our category</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-400" aria-hidden>✓</span>
              <span><strong className="text-zinc-100">Evidence-based</strong> exercise selection for every goal</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-400" aria-hidden>✓</span>
              <span><strong className="text-zinc-100">One-tap</strong> scheduling to Google Calendar, every week</span>
            </li>
          </ul>
        </section>

        {/* CTA */}
        <section className="flex flex-col items-center gap-4 text-center">
          <p className="max-w-md text-sm text-zinc-400 sm:text-base">
            {hasPlan === null
              ? "Loading…"
              : hasPlan
                ? "You already have a plan. Update your metrics and regenerate anytime."
                : "Set your metrics and goals to get your first weekly plan in under a minute."}
          </p>
          {hasPlan !== null && (
            <Link
              href="/onboarding"
              className="rounded-full bg-emerald-400 px-8 py-3 text-base font-semibold text-emerald-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-300"
            >
              {hasPlan ? "Update metrics" : "Create your plan"}
            </Link>
          )}
        </section>

        {/* Secondary links */}
        <section className="flex flex-wrap justify-center gap-4 text-sm">
          <Link
            href="/plan"
            className="rounded-full border border-zinc-700 px-4 py-2 text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-900"
          >
            View my plan
          </Link>
          <Link
            href="/metrics"
            className="rounded-full border border-zinc-700 px-4 py-2 text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-900"
          >
            Current metrics
          </Link>
          <Link
            href="/schedule"
            className="rounded-full border border-zinc-700 px-4 py-2 text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-900"
          >
            Schedule
          </Link>
          <Link
            href="/profile"
            className="rounded-full border border-zinc-700 px-4 py-2 text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-900"
          >
            Profile
          </Link>
        </section>
      </main>
    </div>
  );
}
