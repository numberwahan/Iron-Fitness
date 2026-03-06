export type Gender = "male" | "female" | "non_binary" | "prefer_not_to_say";

export type TrainingGoal =
  | "fat_loss"
  | "muscle_gain"
  | "strength"
  | "endurance"
  | "general_fitness";

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export type EquipmentType =
  | "bodyweight_only"
  | "dumbbells"
  | "barbell"
  | "machines"
  | "full_gym";

export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "legs"
  | "core"
  | "full_body"
  | "cardio";

export type PrescriptionType = "reps" | "time";

export interface RepsPrescription {
  type: "reps";
  sets: number;
  reps: number;
}

export interface TimePrescription {
  type: "time";
  sets: number;
  seconds: number;
}

export type ExercisePrescription = RepsPrescription | TimePrescription;

export interface UserProfile {
  gender: Gender | null;
  age?: number;
  heightCm: number;
  weightKg: number;
  experienceLevel: ExperienceLevel;
  goal: TrainingGoal;
  availableEquipment: EquipmentType[];
  daysPerWeek: number;
  sessionDurationMinutes?: number;
}

export interface Exercise {
  slug: string;
  name: string;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles?: MuscleGroup[];
  equipment: EquipmentType | "none";
  difficulty: ExperienceLevel;
  description: string;
  cues: string[];
  defaultPrescription: ExercisePrescription;
  videoUrl?: string;
}

export interface WorkoutExercise {
  exerciseSlug: string;
  prescription: ExercisePrescription;
  notes?: string;
  order: number;
}

export interface WorkoutDay {
  id: string;
  name: string;
  focus: string;
  exercises: WorkoutExercise[];
  estimatedDurationMinutes: number;
  notes?: string;
}

export interface WeeklyPlan {
  id: string;
  profile: UserProfile;
  days: WorkoutDay[];
  createdAt: string;
}

export interface ScheduleItem {
  id: string;
  workoutDayId: string;
  startDateTime: string; // ISO string
  durationMinutes: number;
  dayOfWeekCode?: string;
}

