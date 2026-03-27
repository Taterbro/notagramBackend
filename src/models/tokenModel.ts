import { pool } from "@/config/database.js";
import { QueryError } from "mysql2";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { tokens } from "@/types/models.js";
import crypto from "crypto";
import { error } from "node:console";

const promisePool = pool.promise();
export async function createToken(token: tokens) {
  try {
    const [result] = await promisePool.query<ResultSetHeader>(
      `INSERT INTO tokens(tokenHash,expiresAt,createdAt,deviceId,userId) VALUES(?,?,?,?,?)`,
      [
        token.tokenHash,
        token.expiresAt,
        token.createdAt,
        token.deviceId,
        token.userId,
      ]
    );
    const payload = await promisePool.query<RowDataPacket[]>(
      "SELECT * FROM tokens WHERE id = ?",
      [result.insertId]
    );
    return payload[0][0];
  } catch (err) {
    if (err instanceof Error) {
      console.log("error from createUser fn: ", err.message);
      throw new Error("Something went wrong while trying to register token");
    } else {
      console.log("Something went wrong");
      return;
    }
  }
}

export async function getToken({
  userId,
  tokenId,
}: {
  userId?: string;
  tokenId?: string;
}) {
  if (!userId && !tokenId) {
    throw new Error("Please enter either a user id or a token Id");
  }
  try {
    let result = null;
    if (userId) {
      [result] = await promisePool.query<RowDataPacket[]>(
        `SELECT * FROM tokens WHERE userId = ?`,
        [userId]
      );
    } else if (tokenId) {
      [result] = await promisePool.query<RowDataPacket[]>(
        `SELECT * FROM tokens WHERE id = ?`,
        [tokenId]
      );
    }
    console.log("get token result: ", result);
    return result && result.length !== 0 ? result[0] : null;
  } catch (err) {
    if (err instanceof Error) {
      console.log("error from createUser fn: ", err.message);
      throw new Error("Something went wrong while trying to register token");
    } else {
      console.log("Something went wrong");
      return;
    }
  }
}

export async function deleteToken({
  userId,
  tokenId,
}: {
  userId?: string;
  tokenId?: string;
}) {
  if (!userId && !tokenId) {
    throw new Error("Please enter either a user id or a token Id");
  }
  try {
    let result = null;
    if (userId) {
      [result] = await promisePool.query<ResultSetHeader>(
        `DELETE FROM tokens WHERE userId = ?`,
        [userId]
      );
    } else if (tokenId) {
      [result] = await promisePool.query<ResultSetHeader>(
        `DELETE FROM tokens WHERE id = ?`,
        [tokenId]
      );
    }
    console.log("get token result: ", result);
    return result;
  } catch (err) {
    if (err instanceof Error) {
      console.log("error from createUser fn: ", err.message);
      throw new Error("Something went wrong while trying to register token");
    } else {
      console.log("Something went wrong");
      return;
    }
  }
}

export async function isTokenValid(fullToken: string) {
  console.log("full toke is: \n", fullToken);
  try {
    const tokenId = fullToken.split("|")[0];
    const token = fullToken.split("|")[1];
    if (!token || !tokenId) {
      throw new Error("Token and/or token ID is missing");
    }
    console.log("tokenId: ", tokenId, "\n", "token: ", token);
    const result = await getToken({ tokenId: tokenId });
    if (result === null) {
      return false;
    }
    console.log("resultah: ", result);
    const newHash = crypto.createHash("sha256").update(token).digest("hex");
    const isValid = result && newHash === result.tokenHash;
    if (!isValid) {
      return false;
    }
    if (isValid) {
      return true;
    }
  } catch (err) {
    console.log("error from fn (isTokenValid)\n", err);
    return false;
  }
}
