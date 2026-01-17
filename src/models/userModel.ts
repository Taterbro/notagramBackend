import { pool } from "@/config/database.js";
import { QueryError } from "mysql2";
import { addUser } from "@/types/users.js";

export async function createUser(user: addUser) {
  try {
    const response = await pool.query(
      `INSERT INTO users(email, name, password,pfp) VALUES(${user.email},${user.name},${user.password},${user.pfp})`
    );
    return response;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
      return;
    } else {
      console.log("Something went wrong");
      return;
    }
  }
}
