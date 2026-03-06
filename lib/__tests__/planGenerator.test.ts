import { generatePlan } from "../planGenerator";
import { UserProfile } from "../types";

const baseProfile: UserProfile = {
  gender: "male",
  age: 28,
  heightCm: 180,
  weightKg: 80,
  experienceLevel: "beginner",
  goal: "general_fitness",
  availableEquipment: ["bodyweight_only"],
  daysPerWeek: 3,
  sessionDurationMinutes: 45,
};

describe("generatePlan", () => {
  it("creates the correct number of days", () => {
    const profile = { ...baseProfile, daysPerWeek: 3 };
    const plan = generatePlan(profile);
    expect(plan.days).toHaveLength(3);
  });

  it("adapts split for 4 days (upper/lower)", () => {
    const profile = { ...baseProfile, daysPerWeek: 4 };
    const plan = generatePlan(profile);
    expect(plan.days).toHaveLength(4);
    expect(plan.days[0].name.toLowerCase()).toContain("upper");
    expect(plan.days[1].name.toLowerCase()).toContain("lower");
  });

  it("caps duration when sessionDurationMinutes is provided", () => {
    const profile = { ...baseProfile, daysPerWeek: 3, sessionDurationMinutes: 30 };
    const plan = generatePlan(profile);
    plan.days.forEach((day) => {
      expect(day.estimatedDurationMinutes).toBeLessThanOrEqual(30);
    });
  });
});

