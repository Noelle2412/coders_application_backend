import { ChallengeModel } from "../models/Challenge.js";
import { SubmissionModel } from "../models/Submission.js";
import { CoderModel } from "../models/Coder.js";

const CODE_RUNNER_URL = process.env.CODE_RUNNER_URL;

/**
 * Service to grade a challenge submission.
 *
 * Rules:
 * 1. Only coders can submit.
 * 2. If the coder has already solved the challenge, reject with 400.
 * 3. Builds code runner payload: { lang, code, func_name, tests: [{ _id, inputs: [{ value }], output }] }
 * 4. Calls external code runner.
 * 5. If passed, score = sum(test_case_weight * 100), added to user's total score.
 * 6. If failed, score = 0, passed = false.
 * 7. Persists submission in SubmissionModel.
 */
export const gradeSubmissionService = async ({
  coderId,
  challengeId,
  lang,
  code,
}) => {
  const challenge = await ChallengeModel.findById(challengeId);
  if (!challenge) {
    const error = new Error("Challenge not found");
    error.statusCode = 404;
    throw error;
  }

  // Check if coder has already solved this challenge
  const alreadySolved = await SubmissionModel.findOne({
    coder: coderId,
    challenge: challenge._id,
    passed: true,
  });

  if (alreadySolved) {
    const error = new Error("Challenge has already been solved by this coder.");
    error.statusCode = 409;
    throw error;
  }

  // Prepare test cases for code runner
  // Runner expects: [{ _id, inputs: [{ value: ... }], output: ... }]
  const runnerTests = challenge.tests.map((t, index) => {
    const testId = t._id ? t._id.toString() : `test_${index}_${Date.now()}`;
    const testInputs = (t.inputs || []).map((inp) => ({
      value: inp.value !== undefined ? inp.value : inp,
    }));

    return {
      _id: testId,
      inputs: testInputs,
      output: t.output,
    };
  });

  const funcName = challenge.code?.function_name || "";

  const runnerPayload = {
    lang,
    code,
    func_name: funcName,
    tests: runnerTests,
  };

  let runnerResponseData;
  try {
    const response = await fetch(CODE_RUNNER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(runnerPayload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[CodeRunner Error ${response.status}]:`, errText);
      const error = new Error(
        `Code runner error: ${errText || response.statusText}`,
      );
      error.statusCode = 502;
      throw error;
    }

    runnerResponseData = await response.json();
  } catch (err) {
    if (err.statusCode) throw err;
    console.error("[CodeRunner Fetch Error]:", err.message);
    const error = new Error(
      `Failed to communicate with code runner: ${err.message}`,
    );
    error.statusCode = 502;
    throw error;
  }

  const isPassed = runnerResponseData.status === "passed";

  // Calculate score: score = sum over all test cases (test case weight * 100) if passed, else 0
  let calculatedScore = 0;
  if (isPassed) {
    calculatedScore = challenge.tests.reduce((sum, t) => {
      const weight =
        t.weight !== undefined ? t.weight : 1 / challenge.tests.length;
      return sum + weight * 100;
    }, 0);
    calculatedScore = Math.round(calculatedScore);
  }

  // Create submission record
  const submission = await SubmissionModel.create({
    coder: coderId,
    challenge: challenge._id,
    code,
    language: lang,
    passed: isPassed,
    score: calculatedScore,
    submittedAt: new Date(),
  });

  // If passed, add score to coder's total score
  if (isPassed && calculatedScore > 0) {
    await CoderModel.findByIdAndUpdate(coderId, {
      $inc: { score: calculatedScore },
    });
  }

  return {
    submission,
    runnerResponse: runnerResponseData,
    passed: isPassed,
    score: calculatedScore,
  };
};
