import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Coder";
const COLLECTION_NAME = "coders";

const CoderSchema = new Schema(
  {
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    password: {
      type: Schema.Types.String,
      required: function () {
        return this.provider === "local";
      },
    },
    lastName: {
      type: Schema.Types.String,
      required: true,
    },
    firstName: {
      type: Schema.Types.String,
      required: true,
    },
    avatar: {
      type: Schema.Types.String,
    },
    description: {
      type: Schema.Types.String,
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const CoderModel = model(DOCUMENT_NAME, CoderSchema, COLLECTION_NAME);
