import { Router } from "express";
import {
  changePassword,
  deleteUser,
  firstStudentVerify,
  getAllUser,
  registerStudent,
  registerUser,
  resetPassword,
  signInStudent,
  signInUser,
  verifyUser,
} from "../Controller/authController";
import validatorHandler from "../utils/validatorHandler";
import {
  changeValidator,
  createStudentValidator,
  createUserValidator,
  resetValidator,
  signInStudentValidator,
  signInUserValidator,
} from "../utils/validator";

const router = Router();

router
  .route("/register-user")
  .post(validatorHandler(createUserValidator), registerUser);
router
  .route("/register-student")
  .post(validatorHandler(createStudentValidator), registerStudent);
router
  .route("/sign-in-student")
  .post(validatorHandler(signInStudentValidator), signInStudent);
router
  .route("/sign-in-user")
  .post(validatorHandler(signInUserValidator), signInUser);
router
  .route("/reset-password")
  .patch(validatorHandler(resetValidator), resetPassword);
router
  .route("/:token/change-password")
  .patch(validatorHandler(changeValidator), changePassword);
router.route("/get-all-user").get(getAllUser);
router.route("/:userID/delete-user").delete(deleteUser);
router.route("/:token/verify-user").get(verifyUser);
router.route("/:token/student-secret-key").patch(firstStudentVerify);

export default router;
