import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Manager";
const COLLECTION_NAME = "managers";

const ManagerSchema = new Schema(
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
