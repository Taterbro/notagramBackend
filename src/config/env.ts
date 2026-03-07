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

  redisUsername: require("REDIS_USERNAME"),
  redisPassword: require("REDIS_PASSWORD"),
  redisHost: require("REDIS_HOST"),
  redisPort: Number(require("REDIS_PORT")),

  resendApiKey: require("RESEND_API_KEY"),
};
