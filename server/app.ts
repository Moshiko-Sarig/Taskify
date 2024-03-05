import express, { Request, Response } from "express";
import * as dotenv from 'dotenv';
dotenv.config();
import cors from "cors";
import cookieParser from 'cookie-parser';
import userRoutes from "./src/routes/user.routes";
import { errorHandler } from './src/middlewares/errorHandler';
import tasksRoutes from "./src/routes/tasks.routes"

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN, 
  credentials: true
}));

app.use("/api/v1", [userRoutes,tasksRoutes]);

app.use("*", (req: Request, res: Response) => {
  res.status(404).send(`Route not found ${req.originalUrl}`);
});

app.use(errorHandler);

const server = app.listen(process.env.APP_PORT, () => {
  console.log("Server is listening on port:", process.env.APP_PORT);
}).on("error", (err: NodeJS.ErrnoException) => {
  console.log(err);
  if (err.code === "EADDRINUSE") {
    console.log("Error: Address in use");
  } else {
    console.log("Error: Unknown error");
  }
});

export default server;
