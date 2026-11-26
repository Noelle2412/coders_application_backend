import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Challenge";
const COLLECTION_NAME = "challenges";

const CodeTextSchema = new Schema(
  {
    language: {
      type: String,
      enum: ["py", "js"],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const InputSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const CodeSchema = new Schema(
  {
    function_name: {
      type: String,
      required: true,
    },
    code_text: {
      type: [CodeTextSchema],
      required: true,
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length === 2;
        },
        message: "code_text must contain exactly 2 items (py and js).",
      },
    },
    inputs: {
      type: [InputSchema],
      required: true,
    },
  },
  { _id: false },
);

const TestInputSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { _id: false },
);

const TestSchema = new Schema(
  {
    weight: {
      type: Number,
    },
    inputs: {
      type: [TestInputSchema],
      required: true,
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length >= 1;
        },
        message: "Test case must contain at least 1 input.",
      },
    },
    output: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { _id: false },
);

const ChallengeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    manager: { type: ObjectId, ref: "Manager" },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    level: {
      type: String,
      enum: ["Easy", "Moderate", "Hard"],
      required: true,
    },
    code: {
      type: CodeSchema,
      required: true,
    },
    tests: {
      type: [TestSchema],
      required: true,
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length >= 1;
        },
        message: "tests must contain at least 1 test case.",
      },
    },
  },
  {
    timestamps: true,
  },
);

export const ChallengeModel = model(
  DOCUMENT_NAME,
  ChallengeSchema,
  COLLECTION_NAME,
);
