import { Schema, model } from "mongoose";
import { iFeeData } from "../utils/interface";

const feeModel = new Schema<iFeeData>(
  {
    ammountPaid: {
      type: Number,
    },
    studentID: {
      type: String,
    },
    schoolName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default model<iFeeData>("fees", feeModel);
