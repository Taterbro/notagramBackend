import { env } from "@/config/env.js";
import mysql from "mysql2";

export const pool = mysql.createPool({
  host: env.mysqlHost,
  user: env.mysqlUser,
  database: env.mysqlDatabaseName,
  password: env.mysqlPassword,
});
