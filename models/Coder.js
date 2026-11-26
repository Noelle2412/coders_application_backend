import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Coder";
const COLLECTION_NAME = "coders";

const CoderSchema = new Schema(
  {
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    lastName: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
    firstName: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
    avatar: {
      type: Schema.Types.String,
      default: "",
    },
    about: {
      type: Schema.Types.String,
      default: "",
    },
    score: {
      type: Number,
      default: 0,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const CoderModel = model(DOCUMENT_NAME, CoderSchema, COLLECTION_NAME);
