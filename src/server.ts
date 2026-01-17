import { env } from "./config/env.js";
import app from "./app.js";
//import process from "node:process";

const PORT = env.port;

app.listen(PORT, () => {
  console.log("we are so up on port: ", PORT);
});
