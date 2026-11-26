import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Submission";
const COLLECTION_NAME = "submissions";

const SubmissionSchema = new Schema(
  {
    coder: {
      type: Schema.Types.ObjectId,
      ref: "Coder",
      required: true,
    },
    challenge: {
      type: Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
    },
    language: {
      type: String,
      enum: ["py", "js"],
    },
    passed: {
      type: Boolean,
      required: true,
      default: false,
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export const SubmissionModel = model(
  DOCUMENT_NAME,
  SubmissionSchema,
  COLLECTION_NAME,
);
