import Link from "next/link";
import { getExerciseBySlug } from "../../../lib/exercises";

interface ExercisePageProps {
  params: {
    slug: string;
  };
}

export default function ExercisePage({ params }: ExercisePageProps) {
  const exercise = getExerciseBySlug(params.slug);

  if (!exercise) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-50">
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-4 px-4 text-center">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Exercise not found
          </h1>
          <p className="max-w-md text-sm text-zinc-400 sm:text-base">
            This exercise may have been removed or the link is incorrect.
          </p>
          <Link
            href="/plan"
            className="mt-2 rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-300"
          >
            Back to plan
          </Link>
        </main>
      </div>
    );
  }

  const equipmentLabel =
    exercise.equipment === "bodyweight_only"
      ? "Bodyweight"
      : exercise.equipment === "dumbbells"
      ? "Dumbbells"
      : exercise.equipment === "barbell"
      ? "Barbell"
      : exercise.equipment === "machines"
      ? "Machines"
      : "Gym cardio";

  const prescription = exercise.defaultPrescription;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
            Exercise guide
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {exercise.name}
          </h1>
          <p className="text-sm text-zinc-400 sm:text-base">
            {exercise.primaryMuscles.join(", ")} · {equipmentLabel}
          </p>
        </header>

        <section className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
          <div>
            <h2 className="text-sm font-semibold text-zinc-100 sm:text-base">
              How to perform it
            </h2>
            <p className="mt-2 text-sm text-zinc-300">{exercise.description}</p>
          </div>
          {exercise.cues.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-zinc-100 sm:text-base">
                Key cues
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-300">
                {exercise.cues.map((cue) => (
                  <li key={cue}>{cue}</li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 sm:text-base">
              Recommended prescription
            </h3>
            <p className="mt-2 text-sm text-zinc-300">
              {prescription.type === "reps"
                ? `${prescription.sets} sets of ${prescription.reps} reps`
                : `${prescription.sets} rounds of ${prescription.seconds} seconds`}
              . Your current plan may adjust sets or time slightly based on your
              goals, but this is a solid default guideline.
            </p>
          </div>
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

