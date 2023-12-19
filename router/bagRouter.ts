import { Router } from "express";
import { createBag } from "../Controller/bagController";

const router = Router();

router.route("/:studentID/create-bag").post(createBag);

export default router;
