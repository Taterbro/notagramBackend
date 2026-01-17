import dotenv from "dotenv";
dotenv.config();

const require = (name: string) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`environment variable ${name} is missing or undefined`);
  }
  return value;
};

export const env = {
  port: require("PORT"),

  mysqlHost: require("MYSQL_HOST"),
  mysqlUser: require("MYSQL_USER"),
  mysqlPassword: require("MYSQL_PASSWORD"),
  mysqlDatabaseName: require("MYSQL_DATABASE"),
};
