import { Router } from "express";
import {
  createSchool,
  deleteSchool,
  getAllSchools,
  getSchool,
  loginSchool,
  verifySchool,
} from "../Controller/schoolController";

const router = Router();

router.route("/create-school").post(createSchool);
router.route("/login-school").post(loginSchool);
router.route("/:schoolID/verify-school").patch(verifySchool);
router.route("/:schoolID/getSchool").get(getSchool);
router.route("/getSchools").get(getAllSchools);
router.route("/:schoolID/deleteSchool").delete(deleteSchool);

export default router;
