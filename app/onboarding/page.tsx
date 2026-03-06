/* eslint-disable jsx-a11y/label-has-associated-control */
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMemo, useState } from "react";
import { generatePlan } from "../../lib/planGenerator";
import {
  EquipmentType,
  ExperienceLevel,
  Gender,
  TrainingGoal,
  UserProfile,
} from "../../lib/types";

const STORAGE_KEY = "fitness-weekly-plan";
const SIGNUP_KEY = "fitness-signup-date";

type Step = 1 | 2 | 3 | 4;

type UnitSystem = "metric" | "imperial";

interface FormState {
  gender: Gender | "";
  age: string;
  heightCm: string;
  weightKg: string;
  heightFeet: string;
  heightInches: string;
  weightLbs: string;
  unitSystem: UnitSystem;
  experienceLevel: ExperienceLevel;
  goal: TrainingGoal;
  daysPerWeek: string;
  sessionDurationMinutes: string;
  equipment: Record<EquipmentType, boolean>;
}

const initialFormState: FormState = {
  gender: "",
  age: "",
  heightCm: "",
  weightKg: "",
  heightFeet: "",
  heightInches: "",
  weightLbs: "",
  unitSystem: "metric",
  experienceLevel: "beginner",
  goal: "general_fitness",
  daysPerWeek: "3",
  sessionDurationMinutes: "45",
  equipment: {
    bodyweight_only: true,
    dumbbells: false,
    barbell: false,
    machines: false,
    full_gym: false,
  },
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialFormState);

  const handleChange = (
    field: keyof FormState,
    value: string | ExperienceLevel | TrainingGoal | Gender | Record<EquipmentType, boolean>,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleEquipment = (key: EquipmentType) => {
    setForm((prev) => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        [key]: !prev.equipment[key],
      },
    }));
  };

  const toggleUnitSystem = (next: UnitSystem) => {
    setForm((prev) => {
      if (prev.unitSystem === next) return prev;

      if (next === "imperial") {
        const height = Number(prev.heightCm);
        const weight = Number(prev.weightKg);
        let heightFeet = prev.heightFeet;
        let heightInches = prev.heightInches;
        let weightLbs = prev.weightLbs;

        if (!Number.isNaN(height) && height > 0) {
          const totalInches = height / 2.54;
          const feet = Math.floor(totalInches / 12);
          const inches = Math.round(totalInches - feet * 12);
          heightFeet = String(feet);
          heightInches = String(inches);
        }
        if (!Number.isNaN(weight) && weight > 0) {
          weightLbs = String(Math.round(weight / 0.45359237));
        }

        return {
          ...prev,
          unitSystem: next,
          heightFeet,
          heightInches,
          weightLbs,
        };
      }

      const feet = Number(prev.heightFeet);
      const inches = Number(prev.heightInches);
      const lbs = Number(prev.weightLbs);
      let heightCm = prev.heightCm;
      let weightKg = prev.weightKg;

      if (!Number.isNaN(feet) && !Number.isNaN(inches)) {
        const totalInches = feet * 12 + inches;
        heightCm = String(Math.round(totalInches * 2.54));
      }
      if (!Number.isNaN(lbs) && lbs > 0) {
        weightKg = String(Math.round(lbs * 0.45359237));
      }

      return {
        ...prev,
        unitSystem: next,
        heightCm,
        weightKg,
      };
    });
  };

  const isStepValid = useMemo(() => {
    if (step === 1) {
      if (form.unitSystem === "metric") {
        const height = Number(form.heightCm);
        const weight = Number(form.weightKg);
        return (
          !!form.gender &&
          !Number.isNaN(height) &&
          height > 100 &&
          height < 250 &&
          !Number.isNaN(weight) &&
          weight > 30 &&
          weight < 250
        );
      }

      const feet = Number(form.heightFeet);
      const inches = Number(form.heightInches);
      const lbs = Number(form.weightLbs);
      const totalInches = feet * 12 + inches;
      return (
        !!form.gender &&
        !Number.isNaN(totalInches) &&
        totalInches > 48 &&
        totalInches < 96 &&
        !Number.isNaN(lbs) &&
        lbs > 70 &&
        lbs < 550
      );
    }

    if (step === 2) {
      const days = Number(form.daysPerWeek);
      return (
        !!form.goal &&
        !Number.isNaN(days) &&
        days >= 1 &&
        days <= 7
      );
    }

    if (step === 3) {
      return Object.values(form.equipment).some(Boolean);
    }

    if (step === 4) {
      const session = Number(form.sessionDurationMinutes);
      if (Number.isNaN(session) || session < 20 || session > 120) {
        return false;
      }
    }

    return true;
  }, [form, step]);

  const toProfile = (): UserProfile => {
    const days = Number(form.daysPerWeek);
    let height = Number(form.heightCm);
    let weight = Number(form.weightKg);
    const session = Number(form.sessionDurationMinutes);
    const selectedEquipment = (Object.entries(form.equipment) as Array<
      [EquipmentType, boolean]
    >)
      .filter(([, enabled]) => enabled)
      .map(([key]) => key);

    if (form.unitSystem === "imperial") {
      const feet = Number(form.heightFeet);
      const inches = Number(form.heightInches);
      const lbs = Number(form.weightLbs);
      const totalInches = feet * 12 + inches;
      if (!Number.isNaN(totalInches) && totalInches > 0) {
        height = Math.round(totalInches * 2.54);
      }
      if (!Number.isNaN(lbs) && lbs > 0) {
        weight = Math.round(lbs * 0.45359237);
      }
    }

    const profile: UserProfile = {
      gender: (form.gender as Gender) || null,
      age: form.age ? Number(form.age) : undefined,
      heightCm: height,
      weightKg: weight,
      experienceLevel: form.experienceLevel,
      goal: form.goal,
      availableEquipment: selectedEquipment,
      daysPerWeek: days,
      sessionDurationMinutes: session,
    };

    return profile;
  };

  const currentStepLabel = () => {
    if (step === 1) return "Your details";
    if (step === 2) return "Goals & frequency";
    if (step === 3) return "Equipment access";
    return "Session length";
  };

  const handleSubmit = () => {
    setError(null);
    try {
      setSubmitting(true);
      if (typeof window !== "undefined") {
        if (!window.localStorage.getItem(SIGNUP_KEY)) {
          window.localStorage.setItem(SIGNUP_KEY, new Date().toISOString());
        }
        const profile = toProfile();
        const plan = generatePlan(profile);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
      }
      router.push("/plan");
    } catch (e) {
      setError("Something went wrong generating your plan. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <header className="space-y-2">
          <Link href="/" className="text-sm font-semibold uppercase tracking-wide text-emerald-400 hover:text-emerald-300">
            ← Back to home
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Build your optimal weekly workout plan
          </h1>
          <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">
            Tell us about your body, goals, equipment and schedule. We&apos;ll
            generate a structured program you can follow and easily send to your
            calendar.
          </p>
        </header>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-xl shadow-black/40 sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Step {step} of 4
              </p>
              <p className="text-lg font-semibold">{currentStepLabel()}</p>
            </div>
            <div className="flex-1">
              <div className="ml-6 h-1 rounded-full bg-zinc-800">
                <div
                  className="h-1 rounded-full bg-emerald-400 transition-all"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-medium text-zinc-200">
                    Your details
                  </p>
                  <div className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900 px-1 py-1 text-xs">
                    <button
                      type="button"
                      className={`rounded-full px-2.5 py-1 ${
                        form.unitSystem === "metric"
                          ? "bg-emerald-400 text-emerald-950"
                          : "text-zinc-300"
                      }`}
                      onClick={() => toggleUnitSystem("metric")}
                    >
                      Metric
                    </button>
                    <button
                      type="button"
                      className={`rounded-full px-2.5 py-1 ${
                        form.unitSystem === "imperial"
                          ? "bg-emerald-400 text-emerald-950"
                          : "text-zinc-300"
                      }`}
                      onClick={() => toggleUnitSystem("imperial")}
                    >
                      Imperial
                    </button>
                  </div>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-200">
                      Gender
                    </label>
                    <select
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none ring-emerald-500/60 focus:ring"
                      value={form.gender}
                      onChange={(e) =>
                        handleChange("gender", e.target.value as Gender)
                      }
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non_binary">Non-binary</option>
                      <option value="prefer_not_to_say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-200">
                      Age (optional)
                    </label>
                    <input
                      type="number"
                      min={12}
                      max={90}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none ring-emerald-500/60 focus:ring"
                      value={form.age}
                      onChange={(e) => handleChange("age", e.target.value)}
                    />
                  </div>
                  {form.unitSystem === "metric" ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-200">
                          Height (cm)
                        </label>
                        <input
                          type="number"
                          min={120}
                          max={230}
                          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none ring-emerald-500/60 focus:ring"
                          value={form.heightCm}
                          onChange={(e) =>
                            handleChange("heightCm", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-200">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          min={35}
                          max={250}
                          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none ring-emerald-500/60 focus:ring"
                          value={form.weightKg}
                          onChange={(e) =>
                            handleChange("weightKg", e.target.value)
                          }
                          required
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-zinc-200">
                            Height (ft)
                          </label>
                          <input
                            type="number"
                            min={4}
                            max={7}
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none ring-emerald-500/60 focus:ring"
                            value={form.heightFeet}
                            onChange={(e) =>
                              handleChange("heightFeet", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-zinc-200">
                            Height (in)
                          </label>
                          <input
                            type="number"
                            min={0}
                            max={11}
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none ring-emerald-500/60 focus:ring"
                            value={form.heightInches}
                            onChange={(e) =>
                              handleChange("heightInches", e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-200">
                          Weight (lb)
                        </label>
                        <input
                          type="number"
                          min={70}
                          max={550}
                          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none ring-emerald-500/60 focus:ring"
                          value={form.weightLbs}
                          onChange={(e) =>
                            handleChange("weightLbs", e.target.value)
                          }
                          required
                        />
                      </div>
                    </>
                  )}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-200">
                      Training experience
                    </label>
                    <select
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none ring-emerald-500/60 focus:ring"
                      value={form.experienceLevel}
                      onChange={(e) =>
                        handleChange(
                          "experienceLevel",
                          e.target.value as ExperienceLevel,
                        )
                      }
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-zinc-200">
                    Primary goal
                  </label>
                  <div className="grid gap-2 text-sm">
                    {[
                      { id: "fat_loss", label: "Fat loss", desc: "Higher reps, more conditioning." },
                      { id: "muscle_gain", label: "Muscle gain", desc: "Moderate reps, more volume." },
                      { id: "strength", label: "Strength", desc: "Lower reps, heavier lifts." },
                      { id: "endurance", label: "Endurance", desc: "Cardio and time-based work." },
                      { id: "general_fitness", label: "General fitness", desc: "Balanced training across the week." },
                    ].map((goal) => (
                      <button
                        key={goal.id}
                        type="button"
                        className={`flex flex-col rounded-lg border px-3 py-2 text-left transition ${
                          form.goal === goal.id
                            ? "border-emerald-400 bg-emerald-400/10"
                            : "border-zinc-700 bg-zinc-900 hover:border-zinc-500"
                        }`}
                        onClick={() =>
                          handleChange("goal", goal.id as TrainingGoal)
                        }
                      >
                        <span className="text-sm font-medium">{goal.label}</span>
                        <span className="text-xs text-zinc-400">{goal.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-zinc-200">
                    Training days per week
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={7}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none ring-emerald-500/60 focus:ring"
                    value={form.daysPerWeek}
                    onChange={(e) => handleChange("daysPerWeek", e.target.value)}
                    required
                  />
                  <p className="text-xs text-zinc-400">
                    We&apos;ll structure your week differently for 1–3 days
                    (full body), 4 days (upper / lower), or 5–7 days
                    (push / pull / legs / conditioning).
                  </p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-zinc-300">
                  Select everything you reliably have access to. We&apos;ll only
                  program exercises you can actually perform.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      { id: "bodyweight_only", label: "Bodyweight only", desc: "No equipment, just your body." },
                      { id: "dumbbells", label: "Dumbbells", desc: "Single pair or full rack." },
                      { id: "barbell", label: "Barbell", desc: "Barbell and plates." },
                      { id: "machines", label: "Machines", desc: "Cable and selectorized machines." },
                      { id: "full_gym", label: "Full gym", desc: "Access to most standard equipment." },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        toggleEquipment(item.id as EquipmentType)
                      }
                      className={`flex flex-col rounded-lg border px-3 py-2 text-left text-sm transition ${
                        form.equipment[item.id as EquipmentType]
                          ? "border-emerald-400 bg-emerald-400/10"
                          : "border-zinc-700 bg-zinc-900 hover:border-zinc-500"
                      }`}
                    >
                      <span className="font-medium">{item.label}</span>
                      <span className="text-xs text-zinc-400">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-200">
                    Typical session length (minutes)
                  </label>
                  <input
                    type="number"
                    min={20}
                    max={120}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none ring-emerald-500/60 focus:ring"
                    value={form.sessionDurationMinutes}
                    onChange={(e) =>
                      handleChange("sessionDurationMinutes", e.target.value)
                    }
                    required
                  />
                  <p className="text-xs text-zinc-400">
                    We&apos;ll tailor the estimated volume for each day to fit
                    roughly within this time.
                  </p>
                </div>
                <div className="space-y-2 text-sm text-zinc-300">
                  <p className="font-medium">What you&apos;ll receive</p>
                  <ul className="list-disc space-y-1 pl-5 text-xs text-zinc-400 sm:text-sm">
                    <li>Structured weekly plan based on your inputs.</li>
                    <li>Each exercise with clear sets / reps or time right next to the name.</li>
                    <li>Click into any exercise for simple how-to explanations.</li>
                    <li>Option to schedule each workout and send it to Google Calendar.</li>
                  </ul>
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm font-medium text-red-400">{error}</p>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev))}
              className="text-sm font-medium text-zinc-400 hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>
            <div className="flex gap-3">
              {step < 4 && (
                <button
                  type="button"
                  disabled={!isStepValid}
                  onClick={() =>
                    setStep((prev) =>
                      prev < 4 && isStepValid ? ((prev + 1) as Step) : prev,
                    )
                  }
                  className="rounded-full bg-zinc-100 px-5 py-2 text-sm font-medium text-zinc-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue
                </button>
              )}
              {step === 4 && (
                <button
                  type="button"
                  disabled={!isStepValid || submitting}
                  onClick={handleSubmit}
                  className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Generating plan..." : "Generate my plan"}
                </button>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
