import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Challenge";
const COLLECTION_NAME = "challenges";

const FunctionInputDefinitionSchema = new Schema({
  name: {
    type: String,
  },
  type: {
    type: String,
  },
});

const CodeSchema = new Schema({
  codeContent: {
    type: String,
  },
  functionName: {
    type: String,
  },
  functionInputDefinition: {
    type: FunctionInputDefinitionSchema,
  },
});

const FunctionInputValueSchema = new Schema({
  name: {
    type: String,
  },
  value: {
    type: Schema.Types.Mixed,
  },
});

const TestCaseSchema = new Schema({
  weight: {
    type: Number,
  },
  functionInputValues: {
    type: [FunctionInputValueSchema],
  },
});

const ChallengeSchema = new Schema(
  {
    level: {
      type: String,
      enum: ["Easy", "Moderate", "Hard"],
      required: true,
    },
    category: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    code: {
      type: CodeSchema,
      required: true,
    },
    testCases: {
      type: [TestCaseSchema],
      required: true,
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
