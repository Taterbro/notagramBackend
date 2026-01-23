import { pool } from "@/config/database.js";
import { QueryError } from "mysql2";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { addUser } from "@/types/users.js";

const promisePool = pool.promise();
export async function createUser(user: addUser) {
  try {
    const [result, fields] = await promisePool.query<ResultSetHeader>(
      `INSERT INTO users(email,password) VALUES(?,?)`,
      [user.email, user.password]
    );
    const payload = await promisePool.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [result.insertId]
    );
    return payload[0][0];
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

interface getUserParams {
  email?: string;
  id?: string;
}
export async function getUser(args: getUserParams) {
  try {
    if (args.email) {
      const [results] = await promisePool.query<RowDataPacket[]>(
        `SELECT * FROM USERS WHERE email = ?`,
        [args.email]
      );
      const user = results.length > 0 ? results[0] : null;
      return user;
    } else if (args.id) {
      const [results] = await promisePool.query<RowDataPacket[]>(
        `SELECT * FROM USERS WHERE id = ?`,
        [args.id]
      );
      const user = results.length > 0 ? results[0] : null;
      return user;
    }
  } catch (err) {
    console.log("error from userExists fn: ", err);
    throw new Error("Something went wrong while trying to verify user details");
  }
}
