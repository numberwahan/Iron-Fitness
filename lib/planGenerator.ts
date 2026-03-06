import { filterExercisesByEquipment, EXERCISES } from "./exercises";
import {
  ExercisePrescription,
  UserProfile,
  WeeklyPlan,
  WorkoutDay,
  WorkoutExercise,
} from "./types";

const createId = (prefix: string, index: number) => `${prefix}-${index + 1}`;

const adjustPrescriptionForGoal = (
  base: ExercisePrescription,
  goal: UserProfile["goal"],
  experience: UserProfile["experienceLevel"],
): ExercisePrescription => {
  if (base.type === "reps") {
    let sets = base.sets;
    let reps = base.reps;

    if (goal === "muscle_gain") {
      sets = Math.min(base.sets + 1, base.sets + 2);
      reps = Math.min(Math.max(reps, 8), 12);
    } else if (goal === "strength") {
      sets = Math.max(base.sets, 3);
      reps = Math.max(Math.min(reps, 6), 4);
    } else if (goal === "fat_loss" || goal === "endurance") {
      sets = base.sets;
      reps = Math.max(reps, 12);
    }

    if (experience === "beginner") {
      sets = Math.max(2, sets - 1);
    } else if (experience === "advanced") {
      sets = sets + 1;
    }

    return { type: "reps", sets, reps };
  }

  let sets = base.sets;
  let seconds = base.seconds;

  if (goal === "fat_loss" || goal === "endurance") {
    seconds = Math.max(base.seconds, 30);
  }

  if (experience === "beginner") {
    seconds = Math.min(seconds, base.seconds);
  } else if (experience === "advanced") {
    sets = sets + 1;
  }

  return { type: "time", sets, seconds };
};

const estimateDuration = (exercises: WorkoutExercise[]): number => {
  const perExercise = exercises.reduce((total, ex) => {
    const base = ex.prescription;
    const restSeconds =
      base.type === "reps" ? 60 : 45;
    const workSeconds =
      base.type === "reps" ? base.reps * 4 * base.sets : base.seconds * base.sets;
    return total + workSeconds + restSeconds * base.sets;
  }, 0);

  return Math.round(perExercise / 60);
};

const selectByMuscles = (
  equippedExercises: typeof EXERCISES,
  primary: string[],
  secondary: string[] = [],
) =>
  equippedExercises.filter(
    (e) =>
      primary.some((m) => e.primaryMuscles.includes(m as never)) ||
      secondary.some((m) => e.secondaryMuscles?.includes(m as never)),
  );

const pickCycled = (
  list: typeof EXERCISES,
  dayIndex: number,
  offset: number,
): (typeof EXERCISES)[number] | undefined => {
  if (list.length === 0) return undefined;
  const index = (dayIndex + offset) % list.length;
  return list[index];
};

const buildFullBodyDay = (
  profile: UserProfile,
  dayIndex: number,
): WorkoutDay => {
  const equippedExercises = filterExercisesByEquipment(
    profile.availableEquipment,
  );

  const squats = selectByMuscles(equippedExercises, ["quads", "glutes"]);
  const hinges = selectByMuscles(equippedExercises, ["hamstrings", "glutes"]);
  const horizontalPush = selectByMuscles(equippedExercises, ["chest"]);
  const horizontalPull = selectByMuscles(equippedExercises, ["back"]);
  const verticalPush = selectByMuscles(equippedExercises, ["shoulders"]);
  const core = selectByMuscles(equippedExercises, ["core"]);
  const cardio = equippedExercises.filter((e) =>
    e.primaryMuscles.includes("cardio" as never),
  );

  const templates: (typeof EXERCISES)[number][] = [];

  const push = pickCycled(horizontalPush, dayIndex, 0);
  const pull = pickCycled(horizontalPull, dayIndex, 1);
  const squat = pickCycled(squats, dayIndex, 2);
  const hinge = pickCycled(hinges, dayIndex, 3);
  const shoulder = pickCycled(verticalPush, dayIndex, 0);
  const trunk = pickCycled(core, dayIndex, 1);
  const conditioning = pickCycled(cardio, dayIndex, 2);

  [squat, hinge, push, pull, shoulder, trunk, conditioning].forEach((ex) => {
    if (ex) templates.push(ex);
  });

  const chosenExercises: WorkoutExercise[] = templates.map((ex, index) => {
    const prescription = adjustPrescriptionForGoal(
      ex.defaultPrescription,
      profile.goal,
      profile.experienceLevel,
    );
    return {
      exerciseSlug: ex.slug,
      prescription,
      order: index,
    };
  });

  const maxExercises = profile.goal === "strength" ? 6 : 8;
  const trimmed = chosenExercises.slice(0, maxExercises);

  const estimatedDuration = estimateDuration(trimmed);

  return {
    id: createId("full-body", dayIndex),
    name: `Full Body Day ${dayIndex + 1}`,
    focus: "Full body strength and conditioning",
    exercises: trimmed,
    estimatedDurationMinutes: estimatedDuration,
    notes:
      "Warm up for 5–10 minutes. Rest 60–90 seconds between strength sets, 30–45 seconds between core or conditioning moves.",
  };
};

const buildUpperLowerSplitDay = (
  profile: UserProfile,
  dayIndex: number,
  type: "upper" | "lower",
): WorkoutDay => {
  const equippedExercises = filterExercisesByEquipment(
    profile.availableEquipment,
  );

  const isUpper = type === "upper";

  const pickByNames = (names: string[]): WorkoutExercise[] => {
    const result: WorkoutExercise[] = [];
    names.forEach((name) => {
      const found = equippedExercises.find((e) => e.name === name);
      if (!found) return;
      const prescription = adjustPrescriptionForGoal(
        found.defaultPrescription,
        profile.goal,
        profile.experienceLevel,
      );
      result.push({
        exerciseSlug: found.slug,
        prescription,
        order: result.length,
      });
    });
    return result;
  };

  const upperNames =
    dayIndex % 2 === 0
      ? [
          "Push-Up",
          "Dumbbell Bench Press",
          "Dumbbell Row",
          "Dumbbell Shoulder Press",
          "Lat Pulldown",
          "Plank",
        ]
      : [
          "Elevated Push-Up",
          "Dumbbell Incline Bench Press",
          "Seated Cable Row",
          "Chin-Up",
          "Dumbbell Lateral Raise",
          "Dead Bug",
        ];

  const lowerNames =
    dayIndex % 2 === 0
      ? [
          "Bodyweight Squat",
          "Dumbbell Goblet Squat",
          "Dumbbell Romanian Deadlift",
          "Reverse Lunge",
          "Leg Press",
          "Treadmill Walk",
        ]
      : [
          "Barbell Back Squat",
          "Barbell Deadlift",
          "Glute Bridge",
          "Dumbbell Bulgarian Split Squat",
          "Hack Squat Machine",
          "Jumping Jacks",
        ];

  const chosen = pickByNames(isUpper ? upperNames : lowerNames).slice(0, 7);

  const estimatedDuration = estimateDuration(chosen);

  return {
    id: createId(type, dayIndex),
    name: isUpper ? `Upper Body Day ${dayIndex + 1}` : `Lower Body Day ${dayIndex + 1}`,
    focus: isUpper ? "Upper body push, pull, and core" : "Lower body strength and conditioning",
    exercises: chosen,
    estimatedDurationMinutes: estimatedDuration,
    notes:
      "Complete all sets for one exercise before moving on, or alternate pairs as a superset if you feel comfortable.",
  };
};

const buildPushPullLegsDay = (
  profile: UserProfile,
  dayIndex: number,
  type: "push" | "pull" | "legs" | "conditioning",
): WorkoutDay => {
  const equippedExercises = filterExercisesByEquipment(
    profile.availableEquipment,
  );

  const byName = (names: string[]): WorkoutExercise[] => {
    const result: WorkoutExercise[] = [];
    names.forEach((name) => {
      const found = equippedExercises.find((e) => e.name === name);
      if (!found) return;
      const prescription = adjustPrescriptionForGoal(
        found.defaultPrescription,
        profile.goal,
        profile.experienceLevel,
      );
      result.push({
        exerciseSlug: found.slug,
        prescription,
        order: result.length,
      });
    });
    return result;
  };

  let names: string[];
  let focus: string;

  if (type === "push") {
    names =
      dayIndex % 2 === 0
        ? [
            "Push-Up",
            "Dumbbell Bench Press",
            "Dumbbell Shoulder Press",
            "Barbell Overhead Press",
            "Plank",
          ]
        : [
            "Elevated Push-Up",
            "Dumbbell Incline Bench Press",
            "Dumbbell Lateral Raise",
            "Barbell Bench Press",
            "Dead Bug",
          ];
    focus = "Chest, shoulders, triceps, and core";
  } else if (type === "pull") {
    names =
      dayIndex % 2 === 0
        ? [
            "Dumbbell Row",
            "Seated Cable Row",
            "Lat Pulldown",
            "Chin-Up",
            "Jumping Jacks",
          ]
        : [
            "Seated Cable Row",
            "Dumbbell Row",
            "Lat Pulldown",
            "Chin-Up",
            "Plank",
          ];
    focus = "Back, biceps, and core";
  } else if (type === "legs") {
    names =
      dayIndex % 2 === 0
        ? [
            "Bodyweight Squat",
            "Dumbbell Goblet Squat",
            "Dumbbell Romanian Deadlift",
            "Reverse Lunge",
            "Glute Bridge",
          ]
        : [
            "Barbell Back Squat",
            "Barbell Deadlift",
            "Dumbbell Bulgarian Split Squat",
            "Hack Squat Machine",
            "Treadmill Walk",
          ];
    focus = "Quads, hamstrings, glutes, and calves";
  } else {
    names = [
      "Jumping Jacks",
      "Burpee (No Push-Up)",
      "Treadmill Walk",
      "Rower Intervals",
      "Plank",
    ];
    focus = "Cardio conditioning and core";
  }

  const chosen = byName(names);

  const estimatedDuration = estimateDuration(chosen);

  return {
    id: createId(type, dayIndex),
    name:
      type === "push"
        ? `Push Day ${dayIndex + 1}`
        : type === "pull"
        ? `Pull Day ${dayIndex + 1}`
        : type === "legs"
        ? `Leg Day ${dayIndex + 1}`
        : `Conditioning Day ${dayIndex + 1}`,
    focus,
    exercises: chosen,
    estimatedDurationMinutes: estimatedDuration,
    notes:
      type === "conditioning"
        ? "Move at a sustainable pace. Keep breathing smooth and take extra rest if needed."
        : "Warm up thoroughly, focus on quality reps over heavy weight.",
  };
};

export const generatePlan = (profile: UserProfile): WeeklyPlan => {
  const days: WorkoutDay[] = [];

  const daysPerWeek = Math.min(Math.max(profile.daysPerWeek, 1), 7);

  if (daysPerWeek <= 3) {
    for (let i = 0; i < daysPerWeek; i += 1) {
      days.push(buildFullBodyDay(profile, i));
    }
  } else if (daysPerWeek === 4) {
    for (let i = 0; i < daysPerWeek; i += 1) {
      const type = i % 2 === 0 ? "upper" : "lower";
      days.push(buildUpperLowerSplitDay(profile, i, type));
    }
  } else {
    const pattern: Array<"push" | "pull" | "legs" | "conditioning"> = [
      "push",
      "pull",
      "legs",
      "push",
      "pull",
      "legs",
      "conditioning",
    ];
    for (let i = 0; i < daysPerWeek; i += 1) {
      const type = pattern[i] ?? "conditioning";
      days.push(buildPushPullLegsDay(profile, i, type));
    }
  }

  if (profile.sessionDurationMinutes) {
    days.forEach((day) => {
      day.estimatedDurationMinutes = Math.min(
        day.estimatedDurationMinutes,
        profile.sessionDurationMinutes ?? day.estimatedDurationMinutes,
      );
    });
  }

  return {
    id: `plan-${profile.goal}-${daysPerWeek}d`,
    profile,
    days,
    createdAt: new Date().toISOString(),
  };
};

