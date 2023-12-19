import { Schema, model, Types } from "mongoose";
import { iProfileData } from "../utils/interface";

const profileModel = new Schema<iProfileData>(
  {
    address: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    balance: {
      type: Number,
    },
    avatar: {
      type: String,
    },
    avatarID: {
      type: String,
    },
    schoolName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    motivation: {
      type: String,
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

export default model<iProfileData>("profiles", profileModel);
