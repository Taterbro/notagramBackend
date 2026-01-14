import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
//import process from "node:process";

const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
  console.log("we are so up on port: ", PORT);
});
