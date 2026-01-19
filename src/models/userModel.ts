import { pool } from "@/config/database.js";
import { QueryError, RowDataPacket } from "mysql2";
import { addUser } from "@/types/users.js";

const promisePool = pool.promise();
export async function createUser(user: addUser) {
  try {
    const response = await promisePool.query(
      `INSERT INTO users(email,password) VALUES(?,?)`,
      [user.email, user.password]
    );
    console.log("le response: ", response);
    return response;
  } catch (err) {
    if (err instanceof Error) {
      console.log("error from createUser fn: ", err.message);
      throw new Error("Something went wrong while trying to register user");
    } else {
      console.log("Something went wrong");
      return;
    }
  }
}

export async function userExists(email: string) {
  try {
    const [results] = await promisePool.query<RowDataPacket[]>(
      `SELECT * FROM USERS WHERE email = ?`,
      [email]
    );
    return results;
  } catch (err) {
    console.log("error from userExists fn: ", err);
    throw new Error("Something went wrong while trying to verify user details");
  }
}
