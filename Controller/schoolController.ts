import { Request, Response } from "express";
import schoolModel from "../Model/schoolModel";
import bcrypt from "bcrypt";
import { sendSchoolMail } from "../utils/email";
import crypto from "crypto";
import { role } from "../utils/roles";

export const createSchool = async (req: Request, res: Response) => {
  try {
    const { schoolName, email, password, address } = req.body;

    const encrypt = await bcrypt.genSalt(10);
    const decipher = await bcrypt.hash(password, encrypt);

    const token = crypto.randomBytes(2).toString("hex");

    const school = await schoolModel.create({
      schoolName,
      email,
      password: decipher,
      address,
      token,
      role: role.SCHOOL,
    });
    sendSchoolMail(school).then(() => {
      console.log("School Mail Sent ...");
    });
    return res.status(201).json({
      message: `${schoolName} school has been created successfully`,
      data: school,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: `An Error Occured: ${error.message}`,
    });
  }
};

export const loginSchool = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const findSchool = await schoolModel.findOne({ email });

    if (findSchool) {
      if (findSchool.verified === true) {
        const isPassword = await bcrypt.compare(findSchool?.password, password);
        if (isPassword) {
          return res.status(200).json({
            message: `Welcome back ${findSchool?.schoolName}`,
          });
        } else {
          return res.status(404).json({
            message: "Incorrect password",
          });
        }
      } else {
        return res.status(404).json({
          message: "School is not verified to operate on this platform",
        });
      }
    } else {
      return res.status(404).json({
        message: "School does not exist on this platform",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: `An Error Occured: ${error.message}`,
    });
  }
};

export const verifySchool = async (req: Request, res: Response) => {
  try {
    const { schoolID } = req.params;

    const findSchool = await schoolModel.findById(schoolID);

    if (findSchool) {
      if (!findSchool.verified && findSchool.token !== "") {
        const verify = await schoolModel.findByIdAndUpdate(schoolID, {
          verified: true,
          token: "",
        });

        return res.status(201).json({
          message: "School has been verifeid",
          data: verify,
        });
      } else {
        return res.status(404).json({
          message: "School is already verified",
        });
      }
    } else {
      return res.status(404).json({
        message: "School does not exist",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: `An Error Occured: ${error.message}`,
    });
  }
};

export const getSchool = async (req: Request, res: Response) => {
  try {
    const { schoolID } = req.params;

    const school = await schoolModel.findById(schoolID);

    return res.status(200).json({
      message: `you have gotten ${school?.schoolName} successfully`,
      data: school,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: `An Error Occured: ${error.message}`,
    });
  }
};

export const getAllSchools = async (req: Request, res: Response) => {
  try {
    const allSchools = await schoolModel.find();

    return res.status(200).json({
      message: "This is all schools",
      data: allSchools,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: `An Error Occured: ${error.message}`,
    });
  }
};

export const deleteSchool = async (req: Request, res: Response) => {
  try {
    const { schoolID } = req.params;

    await schoolModel.findByIdAndDelete(schoolID);

    return res.status(204).json({
      message: "school have been deleted successfully",
    });
  } catch (error: any) {
    return res.status(404).json({
      message: `An Error Occured: ${error.message}`,
    });
  }
};
