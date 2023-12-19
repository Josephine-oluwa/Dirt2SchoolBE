import { Schema, model } from "mongoose";
import { iSchoolData } from "../utils/interface";


const schoolModel = new Schema<iSchoolData>({
    schoolName: {
        type: String,
        required:true
    },
    verified: {
        type: Boolean,
        default: false,
    },
    email: {
        type: String,
        unique:true,
    },
    password: {
        type: String,
    },
    address: {
        type: String,
    },
    token: {
        type: String,
    },
}, {
    timestamps:true
})

export default model<iSchoolData>("schools",schoolModel)