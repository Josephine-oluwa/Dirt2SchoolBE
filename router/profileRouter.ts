import { Router } from "express";
import {
  createProfile,
  deleteOneProfile,
  updateProfile,
  veiwStudentProfile,
  viewOneProfile,
  viewProfile,
} from "../Controller/profileController";
import multer from "multer";

const upload = multer().single("avatar");
const profileRouter = Router();

profileRouter.route("/:studentID/create-profile").post(upload, createProfile);
profileRouter.route("/view-all-profile").get(viewProfile);
profileRouter.route("/:profileID/view-one-profile").get(viewOneProfile);
profileRouter.route("/:profileID/delete-one-profile").delete(deleteOneProfile);
profileRouter.route("/:studentID/view-student-profile").get(veiwStudentProfile);
profileRouter.route("/:profileID/update-profile").patch(updateProfile);

export default profileRouter;
