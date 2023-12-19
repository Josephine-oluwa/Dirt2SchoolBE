import { Router } from "express";
import { createFee } from "../Controller/feeController";

const router = Router();

router.route("/:schoolID/:studentID/create-fee").post(createFee);

export default router;
