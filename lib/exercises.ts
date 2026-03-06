import {
  EquipmentType,
  Exercise,
  ExperienceLevel,
  MuscleGroup,
  TrainingGoal,
  ExercisePrescription,
} from "./types";

const asReps = (sets: number, reps: number): ExercisePrescription => ({
  type: "reps",
  sets,
  reps,
});

const asTime = (sets: number, seconds: number): ExercisePrescription => ({
  type: "time",
  sets,
  seconds,
});

export const EXERCISES: Exercise[] = [
  // Bodyweight
  {
    slug: "bodyweight-squat",
    name: "Bodyweight Squat",
    primaryMuscles: ["quads", "glutes"],
    secondaryMuscles: ["core"],
    equipment: "bodyweight_only",
    difficulty: "beginner",
    description:
      "Stand with feet shoulder-width apart, sit your hips back and down as if into a chair, then drive through your feet to stand tall.",
    cues: [
      "Keep chest up",
      "Knees track over toes",
      "Weight balanced across whole foot",
    ],
    defaultPrescription: asReps(3, 12),
  },
  {
    slug: "push-up-elevated",
    name: "Elevated Push-Up",
    primaryMuscles: ["chest", "triceps"],
    secondaryMuscles: ["shoulders", "core"],
    equipment: "bodyweight_only",
    difficulty: "beginner",
    description:
      "Place hands on a sturdy elevated surface and body in a straight line, lower chest towards hands then press back up.",
    cues: ["Brace your core", "Elbows about 45° from body", "Body stays straight"],
    defaultPrescription: asReps(3, 10),
  },
  {
    slug: "push-up-standard",
    name: "Push-Up",
    primaryMuscles: ["chest", "triceps"],
    secondaryMuscles: ["shoulders", "core"],
    equipment: "bodyweight_only",
    difficulty: "intermediate",
    description:
      "Hands under shoulders, body in a straight line, lower chest to the floor then press back up.",
    cues: ["Brace your core", "Hands just outside shoulders", "Control the descent"],
    defaultPrescription: asReps(3, 12),
  },
  {
    slug: "chin-up",
    name: "Chin-Up",
    primaryMuscles: ["back", "biceps"],
    secondaryMuscles: ["core"],
    equipment: "full_gym",
    difficulty: "intermediate",
    description:
      "Hang from a bar with an underhand shoulder-width grip, brace your core, then pull your chest towards the bar by driving your elbows down and back. Lower yourself under control until your arms are straight before starting the next rep.",
    cues: [
      "Think about pulling elbows to ribs",
      "Keep ribs down and avoid swinging",
      "Use a full range of motion",
    ],
    defaultPrescription: asReps(3, 6),
  },
  {
    slug: "glute-bridge",
    name: "Glute Bridge",
    primaryMuscles: ["glutes", "hamstrings"],
    secondaryMuscles: ["core"],
    equipment: "bodyweight_only",
    difficulty: "beginner",
    description:
      "Lie on your back with knees bent and feet flat, squeeze glutes to lift hips, then lower with control.",
    cues: ["Drive through heels", "Ribs down", "Pause at the top"],
    defaultPrescription: asReps(3, 15),
  },
  {
    slug: "reverse-lunge",
    name: "Reverse Lunge",
    primaryMuscles: ["quads", "glutes"],
    secondaryMuscles: ["hamstrings", "core"],
    equipment: "bodyweight_only",
    difficulty: "intermediate",
    description:
      "Step one leg back into a lunge, dropping the back knee towards the floor, then drive through the front foot to stand.",
    cues: ["Tall torso", "Front knee over mid-foot", "Light tap with back knee"],
    defaultPrescription: asReps(3, 10),
  },
  {
    slug: "plank",
    name: "Plank",
    primaryMuscles: ["core"],
    secondaryMuscles: ["shoulders", "glutes"],
    equipment: "bodyweight_only",
    difficulty: "beginner",
    description:
      "Forearms on the floor, elbows under shoulders, body in a straight line from head to heels.",
    cues: ["Squeeze glutes", "Push the floor away", "Neutral neck"],
    defaultPrescription: asTime(3, 30),
  },
  {
    slug: "dead-bug",
    name: "Dead Bug",
    primaryMuscles: ["core"],
    secondaryMuscles: [],
    equipment: "bodyweight_only",
    difficulty: "beginner",
    description:
      "On your back with arms up and knees over hips, slowly lower opposite arm and leg then return, keeping your low back pressed down.",
    cues: ["Ribs down", "Move slowly", "Exhale as limb lowers"],
    defaultPrescription: asReps(3, 8),
  },
  {
    slug: "jumping-jacks",
    name: "Jumping Jacks",
    primaryMuscles: ["cardio"],
    secondaryMuscles: ["full_body"],
    equipment: "bodyweight_only",
    difficulty: "beginner",
    description:
      "Jump feet out wide while raising arms overhead, then jump feet together while bringing arms down.",
    cues: ["Land softly", "Maintain rhythm", "Breathe steadily"],
    defaultPrescription: asTime(3, 30),
  },
  {
    slug: "burpee-no-pushup",
    name: "Burpee (No Push-Up)",
    primaryMuscles: ["cardio"],
    secondaryMuscles: ["full_body"],
    equipment: "bodyweight_only",
    difficulty: "advanced",
    description:
      "From standing, squat down and place hands on floor, jump feet back to a plank, then jump feet in and stand with a small jump.",
    cues: ["Stay in control", "Land softly", "Keep core tight"],
    defaultPrescription: asReps(3, 8),
  },

  // Dumbbells
  {
    slug: "dumbbell-goblet-squat",
    name: "Dumbbell Goblet Squat",
    primaryMuscles: ["quads", "glutes"],
    secondaryMuscles: ["core"],
    equipment: "dumbbells",
    difficulty: "beginner",
    description:
      "Hold a dumbbell close to your chest, sit hips back and down into a squat, then stand tall.",
    cues: ["Elbows under weight", "Knees track over toes", "Full foot on floor"],
    defaultPrescription: asReps(3, 10),
  },
  {
    slug: "dumbbell-bench-press",
    name: "Dumbbell Bench Press",
    primaryMuscles: ["chest"],
    secondaryMuscles: ["triceps", "shoulders"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    description:
      "Lying on a bench, press dumbbells from chest to straight arms, then lower with control.",
    cues: ["Wrists stacked over elbows", "Shoulder blades pulled back", "Control each rep"],
    defaultPrescription: asReps(3, 10),
  },
  {
    slug: "dumbbell-row",
    name: "Dumbbell Row",
    primaryMuscles: ["back"],
    secondaryMuscles: ["biceps"],
    equipment: "dumbbells",
    difficulty: "beginner",
    description:
      "Hinge at the hips with a flat back and pull the dumbbell towards your hip, then lower under control.",
    cues: ["Chest proud", "Pull with elbow", "Avoid shrugging shoulders"],
    defaultPrescription: asReps(3, 10),
  },
  {
    slug: "dumbbell-shoulder-press",
    name: "Dumbbell Shoulder Press",
    primaryMuscles: ["shoulders"],
    secondaryMuscles: ["triceps"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    description:
      "From shoulder height, press dumbbells straight overhead, then lower until elbows are just below 90°.",
    cues: ["Ribs down", "Press up, not forward", "Control the return"],
    defaultPrescription: asReps(3, 8),
  },
  {
    slug: "dumbbell-romanian-deadlift",
    name: "Dumbbell Romanian Deadlift",
    primaryMuscles: ["hamstrings", "glutes"],
    secondaryMuscles: ["back"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    description:
      "Stand tall with dumbbells in front of thighs, push hips back to lower weights along legs, then drive hips forward to stand.",
    cues: ["Soft knees", "Flat back", "Feel stretch in hamstrings"],
    defaultPrescription: asReps(3, 10),
  },
  {
    slug: "dumbbell-bulgarian-split-squat",
    name: "Dumbbell Bulgarian Split Squat",
    primaryMuscles: ["quads", "glutes"],
    secondaryMuscles: ["hamstrings", "core"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    description:
      "Stand in a split stance with your back foot elevated on a bench. Drop your back knee toward the floor while keeping your torso tall, then drive through the front foot to stand. This loads one leg at a time and is excellent for muscle and stability.",
    cues: [
      "Keep most of the weight in the front leg",
      "Front knee tracks over mid-foot",
      "Lower with control, then drive up powerfully",
    ],
    defaultPrescription: asReps(3, 8),
  },
  {
    slug: "dumbbell-incline-bench-press",
    name: "Dumbbell Incline Bench Press",
    primaryMuscles: ["chest", "shoulders"],
    secondaryMuscles: ["triceps"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    description:
      "Lie on an incline bench set around 30° and press dumbbells from chest to straight arms, emphasizing the upper chest. Lower the weights with control until your elbows are roughly level with the bench.",
    cues: [
      "Keep shoulder blades pulled back",
      "Press the weights up and slightly together",
      "Avoid flaring elbows too wide",
    ],
    defaultPrescription: asReps(3, 10),
  },
  {
    slug: "dumbbell-lateral-raise",
    name: "Dumbbell Lateral Raise",
    primaryMuscles: ["shoulders"],
    secondaryMuscles: [],
    equipment: "dumbbells",
    difficulty: "beginner",
    description:
      "Stand tall holding dumbbells at your sides. With a slight bend in your elbows, raise the weights out to the sides until they reach about shoulder height, then lower with control.",
    cues: [
      "Lead with elbows, not hands",
      "Stop at or just below shoulder height",
      "Avoid swinging or using momentum",
    ],
    defaultPrescription: asReps(3, 12),
  },

  // Barbell / full gym
  {
    slug: "barbell-back-squat",
    name: "Barbell Back Squat",
    primaryMuscles: ["quads", "glutes"],
    secondaryMuscles: ["hamstrings", "core"],
    equipment: "barbell",
    difficulty: "intermediate",
    description:
      "With the barbell on your upper back, sit hips back and down into a squat, then drive up to stand tall.",
    cues: ["Brace before each rep", "Knees track over toes", "Full depth you can control"],
    defaultPrescription: asReps(4, 6),
  },
  {
    slug: "barbell-front-squat",
    name: "Barbell Front Squat",
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "core"],
    equipment: "barbell",
    difficulty: "intermediate",
    description:
      "With the barbell resting across the front of your shoulders, keep your torso upright as you sit your hips down and back into a squat, then stand back up. This variation emphasizes the quads and demands strong core stability.",
    cues: [
      "Elbows stay high throughout the movement",
      "Keep chest proud and torso tall",
      "Sit between your hips, not just back",
    ],
    defaultPrescription: asReps(3, 6),
  },
  {
    slug: "barbell-overhead-press",
    name: "Barbell Overhead Press",
    primaryMuscles: ["shoulders"],
    secondaryMuscles: ["triceps", "core"],
    equipment: "barbell",
    difficulty: "intermediate",
    description:
      "Press the barbell from just above your upper chest to straight arms overhead while standing tall. Brace your core and glutes to keep the torso stable as you lock the bar out over the middle of your foot.",
    cues: [
      "Squeeze glutes and brace abs",
      "Press the bar in a straight line overhead",
      "Move your head out of the bar path, then under it at lockout",
    ],
    defaultPrescription: asReps(3, 5),
  },
  {
    slug: "barbell-deadlift",
    name: "Barbell Deadlift",
    primaryMuscles: ["hamstrings", "glutes"],
    secondaryMuscles: ["back"],
    equipment: "barbell",
    difficulty: "intermediate",
    description:
      "With the bar over mid-foot, hinge down with a flat back, grip the bar, brace, then stand tall by driving through the floor.",
    cues: ["Bar close to shins", "Push the floor away", "Lock out hips and knees together"],
    defaultPrescription: asReps(4, 5),
  },
  {
    slug: "barbell-bench-press",
    name: "Barbell Bench Press",
    primaryMuscles: ["chest"],
    secondaryMuscles: ["triceps", "shoulders"],
    equipment: "barbell",
    difficulty: "intermediate",
    description:
      "Lying on a bench, lower the bar to mid-chest with elbows about 45°, then press back to straight arms.",
    cues: ["Feet planted", "Shoulder blades squeezed", "Control bar path"],
    defaultPrescription: asReps(4, 6),
  },
  {
    slug: "lat-pulldown",
    name: "Lat Pulldown",
    primaryMuscles: ["back"],
    secondaryMuscles: ["biceps"],
    equipment: "machines",
    difficulty: "beginner",
    description:
      "Grip the bar wider than shoulders, pull it to upper chest while driving elbows down, then return with control.",
    cues: ["Lean back slightly", "Pull to collarbone", "Don't shrug shoulders"],
    defaultPrescription: asReps(3, 10),
  },
  {
    slug: "machine-leg-press",
    name: "Leg Press",
    primaryMuscles: ["quads", "glutes"],
    secondaryMuscles: ["hamstrings"],
    equipment: "machines",
    difficulty: "beginner",
    description:
      "With feet shoulder-width on the platform, lower the weight until knees are about 90°, then press back to start.",
    cues: ["Don't lock knees hard", "Lower with control", "Keep lower back on pad"],
    defaultPrescription: asReps(3, 12),
  },
  {
    slug: "machine-hack-squat",
    name: "Hack Squat Machine",
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes"],
    equipment: "machines",
    difficulty: "intermediate",
    description:
      "Stand on the hack squat platform with shoulders under the pads and feet set about shoulder-width. Lower yourself by bending your knees and hips, then press the platform away to return to standing.",
    cues: [
      "Keep your lower back firmly against the pad",
      "Track knees in line with toes",
      "Use a controlled tempo, no bouncing",
    ],
    defaultPrescription: asReps(3, 10),
  },
  {
    slug: "cable-row",
    name: "Seated Cable Row",
    primaryMuscles: ["back"],
    secondaryMuscles: ["biceps"],
    equipment: "machines",
    difficulty: "beginner",
    description:
      "Sit tall with a neutral spine and pull the handle towards your torso, then extend arms under control.",
    cues: ["Chest proud", "Pull elbows past body", "Avoid shrugging"],
    defaultPrescription: asReps(3, 12),
  },
  {
    slug: "treadmill-walk",
    name: "Treadmill Walk",
    primaryMuscles: ["cardio"],
    secondaryMuscles: ["full_body"],
    equipment: "full_gym",
    difficulty: "beginner",
    description:
      "Walk at a brisk but sustainable pace on the treadmill.",
    cues: ["Relax shoulders", "Land softly", "Maintain steady breathing"],
    defaultPrescription: asTime(1, 900),
  },
  {
    slug: "rower-intervals",
    name: "Rower Intervals",
    primaryMuscles: ["cardio"],
    secondaryMuscles: ["back", "legs"],
    equipment: "full_gym",
    difficulty: "intermediate",
    description:
      "Alternate hard rowing efforts with easy recovery rows.",
    cues: ["Drive with legs", "Finish with strong pull", "Smooth rhythm"],
    defaultPrescription: asTime(6, 40),
  },
];

export const getExerciseBySlug = (slug: string): Exercise | undefined =>
  EXERCISES.find((e) => e.slug === slug);

export const filterExercisesByEquipment = (
  equipment: EquipmentType[],
): Exercise[] => {
  const hasFullGym =
    equipment.includes("full_gym") ||
    equipment.includes("barbell") ||
    equipment.includes("machines");

  return EXERCISES.filter((exercise) => {
    if (exercise.equipment === "bodyweight_only") return true;
    if (hasFullGym) return true;
    return equipment.includes(exercise.equipment as EquipmentType);
  });
};

export const filterExercisesByMuscleGroup = (
  exercises: Exercise[],
  muscle: MuscleGroup,
): Exercise[] =>
  exercises.filter(
    (e) =>
      e.primaryMuscles.includes(muscle) ||
      (e.secondaryMuscles && e.secondaryMuscles.includes(muscle)),
  );

export const filterExercisesByGoal = (
  exercises: Exercise[],
  goal: TrainingGoal,
): Exercise[] => {
  if (goal === "fat_loss" || goal === "endurance") {
    return exercises.filter((e) =>
      e.primaryMuscles.includes("cardio") || e.secondaryMuscles?.includes("cardio"),
    );
  }

  if (goal === "strength") {
    return exercises.filter(
      (e) =>
        e.equipment === "barbell" ||
        e.equipment === "machines" ||
        e.equipment === "dumbbells",
    );
  }

  return exercises;
};

