"use client";

import {
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import Link from "next/link";

const appLinks = (
  <>
    <Link
      href="/metrics"
      className="rounded-full px-3 py-1 hover:bg-zinc-900"
    >
      Current metrics
    </Link>
    <Link
      href="/plan"
      className="rounded-full px-3 py-1 hover:bg-zinc-900"
    >
      Plan
    </Link>
    <Link
      href="/schedule"
      className="rounded-full px-3 py-1 hover:bg-zinc-900"
    >
      Schedule
    </Link>
    <Link
      href="/profile"
      className="rounded-full px-3 py-1 hover:bg-zinc-900"
    >
      Profile
    </Link>
  </>
);

export function NavClient() {
  const clerkEnabled =
    typeof process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === "string" &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.length > 0;
  const { isSignedIn } = useAuth();

  return (
    <div className="border-b border-zinc-900/80 bg-zinc-950/95 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight text-zinc-50"
          aria-label="Iron Fitness home"
        >
          <img
            src="/iron-fitness-logo.svg"
            alt="Iron Fitness"
            className="h-9 w-auto"
            width={200}
            height={44}
          />
        </Link>
        <div className="flex items-center gap-4 text-xs font-medium text-zinc-300 sm:text-sm">
          {!clerkEnabled ? (
            appLinks
          ) : (
            <>
              {appLinks}
              {isSignedIn ? (
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8",
                    },
                  }}
                />
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button
                      type="button"
                      className="rounded-full border border-zinc-600 px-3 py-1.5 hover:bg-zinc-800"
                    >
                      Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button
                      type="button"
                      className="rounded-full bg-emerald-500 px-3 py-1.5 font-medium text-emerald-950 hover:bg-emerald-400"
                    >
                      Create account
                    </button>
                  </SignUpButton>
                </>
              )}
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
