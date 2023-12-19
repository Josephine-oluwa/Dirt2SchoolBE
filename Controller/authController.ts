import { Request, Response, response } from "express";
import authModel from "../Model/authModel";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { role } from "../utils/roles";
import { jwtDecode } from "jwt-decode";
import {
  resetAccountPassword,
  sendAccountMail,
  sendFirstAccountMail,
} from "../utils/email";
import env from "dotenv";
env.config();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const value = crypto.randomBytes(32).toString("hex");

    const token = jwt.sign(value, process.env.SECRET!);

    const user = await authModel.create({
      email,
      password: hash,
      token,
      role: role.USER,
    });
    sendAccountMail(user).then(() => {
      console.log("sent verify email");
    });
    return res.status(201).json({
      message: "created successfully",
      data: user,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "Error registering user",
      data: error.message,
    });
  }
};

export const registerStudent = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const value = crypto.randomBytes(32).toString("hex");

    const token = jwt.sign(value, "secret");
    const secretKey = crypto.randomBytes(2).toString("hex");
    const student = await authModel.create({
      email,
      password: hash,
      token,
      secretKey,
      role: role.STUDENT,
    });
    sendFirstAccountMail(student).then(() => {
      console.log("sent student otp");
    });
    return res.status(201).json({
      message: "created successfully",
      data: student,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "Error registering user",
      data: error.message,
    });
  }
};

export const signInUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await authModel.findOne({ email });
    if (user) {
      const check = await bcrypt.compare(password, user.password);
      if (check) {
        if (user.verify && user.token === "") {
          const token = jwt.sign({ id: user._id }, process.env.SECRET!);

          return res.status(201).json({
            message: `${user.email} signed in successfully`,
            data: token,
          });
        } else {
          return res.status(403).json({
            message: "user not verified",
          });
        }
      } else {
        return res.status(403).json({
          message: "invalid password",
        });
      }
    } else {
      return res.status(403).json({
        message: "user not found",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "error signing in",
      data: error.message,
    });
  }
};

export const signInStudent = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const student = await authModel.findOne({ email });
    if (student) {
      const check = await bcrypt.compare(password, student.password);
      if (check) {
        if (student.verify && student.token === "") {
          const token = jwt.sign({ id: student._id }, process.env.SECRET!);

          return res.status(201).json({
            message: `${student.email} signed in successfully`,
            data: token,
          });
        } else {
          return res.status(403).json({
            message: "student not verified ",
          });
        }
      } else {
        return res.status(403).json({
          message: "invalid password",
        });
      }
    } else {
      return res.status(403).json({
        message: "student not found",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "error signing in",
      data: error.message,
    });
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const getID: any = jwt.verify(
      token,
      process.env.SECRET!,
      (err, payload) => {
        if (err) {
          return err;
        } else {
          return payload;
        }
      }
    );

    const user = await authModel.findByIdAndUpdate(
      getID.id,
      { verify: true, token: "" },
      { new: true }
    );

    return res.status(200).json({
      message: "user verified successfully",
      data: user,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "error",
      data: error.message,
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await authModel.findOne({ email });
    if (user?.verify && user.token === "") {
      const token = jwt.sign({ id: user._id }, process.env.SECRET!);
      const reset = await authModel.findByIdAndUpdate(
        user._id,
        { token },
        { new: true }
      );
      resetAccountPassword(user).then(() => {
        console.log("sent reset password email notification");
      });
      return res.status(200).json({
        message: "you can reset your password",
        data: reset,
      });
    } else {
      return res.status(404).json({
        message: "something went wrong",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "error",
      data: error.message,
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const getID: any = jwt.verify(token, "secret", (err, payload) => {
      if (err) {
        return err;
      } else {
        return payload;
      }
    });

    const user = await authModel.findById(getID.id);

    if ((user?.verify && user, token !== "")) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const change = await authModel.findOneAndUpdate(
        user?._id,
        { password: hash, token: "" },
        { new: true }
      );

      return res.status(200).json({
        message: "changed password successfully",
        data: change,
      });
    } else {
      return res.status(404).json({
        message: "user not verified",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "error",
      data: error.message,
    });
  }
};

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const user = await authModel.find();

    return res.status(200).json({
      message: `viewing ${user.length} users`,
      data: user,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "error",
      data: error.message,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;

    await authModel.findByIdAndDelete(userID);

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "error deleting user",
      data: error.message,
    });
  }
};

export const firstStudentVerify = async (req: Request, res: Response) => {
  try {
    const { secretKey } = req.body;
    const { token } = req.params;
    const getID: any = jwt.verify(
      token,
      process.env.SECRET!,
      (err: any, payload: any) => {
        if (err) {
          return err;
        } else {
          return payload;
        }
      }
    );

    const user = await authModel.findById(getID.id);

    if (user?.secretKey === secretKey) {
      sendAccountMail(user).then(() => {
        console.log("sent verification email");
      });

      return res.status(200).json({
        message: "Verification email",
        data: user,
      });
    } else {
      return res.status(400).json({
        message: "error",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "error",
      data: error.message,
    });
  }
};
