import { pool } from "@/config/database.js";
import { QueryError } from "mysql2";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { addUser } from "@/types/models.js";

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

export async function verifyUser(userId: number) {
  try {
    const user = await getUser({ id: String(userId) });
    if (!user) {
      throw new Error("User does not exist");
    }

    const [results] = await promisePool.query<RowDataPacket[]>(
      `UPDATE USERS SET isVerified = 1 WHERE id = ?`,
      [userId]
    );
    const response = results.length > 0 ? results[0] : null;
    return response;
  } catch (error) {
    console.log("error from verifyUser fn: ", error);
    throw new Error("Something went wrong while trying to verify user");
  }
}

export async function isUserVerified(userId: string) {
  const data = { verified: false, message: "" };

  try {
    const userFound = await getUser({ id: userId });
    if (!userFound) {
      data.message = "User not found";
      return data;
    }

    if (userFound.isVerified) {
      data.verified = true;
    } else if (!userFound.isVerified) {
      data.message = "Account not verified";
    }
    return data;
  } catch (err) {
    console.log("error from isUserVerified fn: ", err);
    return data;
  }
}

export async function editUser(
  userId: number,
  user: Omit<Partial<addUser>, "password" | "isDriveActive" | "isVerified">
) {
  try {
    const allowedFields: (keyof addUser)[] = ["name", "pfp"];

    const filteredUser = Object.fromEntries(
      Object.entries(user).filter(([key]) =>
        allowedFields.includes(key as keyof addUser)
      )
    );
    let leString = "";
    const values = Object.values(filteredUser);
    const genCommands = () => {
      (Object.keys(filteredUser) as (keyof addUser)[]).forEach((key) => {
        if (
          key === "password" ||
          key === "isDriveActive" ||
          key === "isVerified"
        ) {
          leString.concat("");
        } else {
          leString = leString.concat(`${key} = ?, `);
        }
      });
      leString = leString.slice(0, -2) + "";
      console.log("le String: ", leString);
      return `UPDATE users SET ${leString} WHERE id = ?`;
    };
    const commands = genCommands();
    const allValues = [...values, userId];
    const payload = await promisePool.execute<RowDataPacket[]>(
      commands,
      allValues
    );
    const response = payload.length > 0 ? payload[0] : null;
    return response;
  } catch (err) {
    if (err instanceof Error) {
      console.log("error from editUser fn: ", err);
      throw new Error("Something went wrong while trying to edit user");
    } else {
      console.log("Something went wrong");
      return;
    }
  }
}
