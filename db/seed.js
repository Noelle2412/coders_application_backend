import bcrypt from "bcrypt";
import { CoderModel } from "../models/Coder.js";
import { ManagerModel } from "../models/Manager.js";
import { ChallengeModel } from "../models/Challenge.js";

export const seedDatabase = async () => {
  try {
    const saltRounds = 10;
    const defaultPassword = await bcrypt.hash("password123", saltRounds);

    // 1. Seed initial Coder if not present
    const existingCoder = await CoderModel.findOne();
    if (!existingCoder) {
      await CoderModel.create({
        firstName: "Ada",
        lastName: "Lovelace",
        email: "ada.lovelace@example.com",
        password: defaultPassword,
        avatar: "AL",
        about: "Pioneering computer programmer and mathematician.",
        score: 150,
        is_verified: true,
      });
      console.log("[Seed] Seeded initial Coder record.");
    }

    // 2. Seed initial Manager if not present
    const existingManager = await ManagerModel.findOne();
    if (!existingManager) {
      await ManagerModel.create({
        firstName: "Grace",
        lastName: "Hopper",
        email: "grace.hopper@example.com",
        password: defaultPassword,
        avatar: "GH",
        about: "Computer scientist and naval officer.",
        is_verified: true,
      });
      console.log("[Seed] Seeded initial Manager record.");
    }

    // 3. Seed initial Challenge if not present
    const existingChallenge = await ChallengeModel.findOne();
    if (!existingChallenge) {
      await ChallengeModel.create({
        title: "Two Sum",
        category: "Algorithms",
        description:
          "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        level: "Easy",
        code: {
          function_name: "two_sum",
          code_text: [
            {
              language: "py",
              text: "def two_sum(nums, target):\n    # Write your solution here\n    pass",
            },
            {
              language: "js",
              text: "function twoSum(nums, target) {\n    // Write your solution here\n}",
            },
          ],
          inputs: [
            { name: "nums", type: "array" },
            { name: "target", type: "number" },
          ],
        },
        tests: [
          {
            inputs: [
              { name: "nums", value: [2, 7, 11, 15] },
              { name: "target", value: 9 },
            ],
            output: [0, 1],
          },
          {
            inputs: [
              { name: "nums", value: [3, 2, 4] },
              { name: "target", value: 6 },
            ],
            output: [1, 2],
          },
        ],
      });
      console.log("[Seed] Seeded initial Challenge record.");
    }
  } catch (error) {
    console.error("[Seed] Error while seeding database:", error.message);
  }
};

export default seedDatabase;
