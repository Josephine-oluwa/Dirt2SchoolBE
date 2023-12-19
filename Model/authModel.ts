import { Schema, model,Types } from "mongoose";
import { iAuthData } from "../utils/interface";

const authModel = new Schema<iAuthData>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
    },
    profile: [
      {
        type: Types.ObjectId,
        ref: "profiles",
      },
    ],
    bagHistory: [
      {
        type: Types.ObjectId,
        ref: "bags",
      },
    ],
    feeHistory: [
      {
        type: Types.ObjectId,
        ref:"fees"
      },
    ],
    secretKey:{
      type: String,
    }
  },
  { timestamps: true }
);

export default model<iAuthData>("users", authModel);
