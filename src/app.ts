import express from "express";
import morgan from "morgan";
import { auth } from "./routes/authRoute.js";
import { errorHandler } from "./config/errorHandler.js";

const app = express();
app.use(morgan("dev"));
app.use(express.json());

app.use("/auth", auth);

app.use(errorHandler);
export default app;
