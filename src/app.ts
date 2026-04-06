import express from "express";
import morgan from "morgan";
import { auth } from "./routes/authRoute.js";
import { errorHandler } from "./config/errorHandler.js";
import { connectToRedis } from "./config/caching.js";
import { limiter } from "./middleware/rateLimiter.js";
import { post } from "./routes/postRoutes.js";
import { connectDrive } from "./routes/connectDrive.js";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(limiter);
await connectToRedis();

app.use("/auth", auth);
app.use("/post", post);
app.use("/connect-drive", connectDrive);

app.use(errorHandler);
export default app;
