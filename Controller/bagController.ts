import { Request, Response } from "express";
import bagModel from "../Model/bagModel";
import authModel from "../Model/authModel";

export const createBag = async (req: Request, res: Response) => {
  try {
    const { studentID } = req.params;
    const { bag, cash } = req.body;

    const student = await authModel.findById(studentID);

    if (student) {
      if (student.verify === true && student.token === "") {
        const createBag = await bagModel.create({
          bag,
          cash,
          studentID,
        });
        return res.status(201).json({
          message:`Your ${bag} has been created successfully`,
          data:createBag
        });
      } else {
        return res.status(404).json({
          message: "student not verified",
        });
      }
    } else {
      return res.status(404).json({
        message: "student does not exist",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: `Error: ${error.message}`,
    });
  }
};


