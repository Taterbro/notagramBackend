import express from "express";
import morgan from "morgan";
import { auth } from "./routes/authRoute.js";
import { errorHandler } from "./config/errorHandler.js";
import { connectToRedis } from "./config/caching.js";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
await connectToRedis();

app.use("/auth", auth);

app.use(errorHandler);
export default app;
