import cors from "cors";
import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import user from "./router/authRouter";
import bag from "./router/authRouter";
import profileRouter from "./router/profileRouter";

const main = (app: Application) => {
  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  app.use(morgan("dev"));
  app.set("view engine", "ejs");

  app.get("/", (req: Request, res: Response) => {
    try {
      return res.status(200).json({
        message: "Success",
      });
    } catch (error: any) {
      return res.status(404).json({
        message: "error",
        data: error.message,
      });
    }
  });

  app.use("/api", user);
  app.use("/api", bag);
  app.use("/api", profileRouter);
};

export default main;
