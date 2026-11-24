import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Manager";
const COLLECTION_NAME = "managers";

const ManagerSchema = new Schema(
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
  },
  {
    timestamps: true,
  },
);

export const ManagerModel = model(
  DOCUMENT_NAME,
  ManagerSchema,
  COLLECTION_NAME,
);
