import { createClient } from "redis";
import { env } from "./env.js";

export const redisClient = createClient({
  username: env.redisUsername,
  password: env.redisPassword,
  socket: {
    host: env.redisHost,
    port: env.redisPort,
  },
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

export const connectToRedis = async () => {
  try {
    redisClient.on("error", (err) => {
      console.log("An error occured while trying to connect to redis");
      throw new Error(err);
    });
    await redisClient.connect();
    console.log("successfully connected to redis db");
  } catch (err) {
    if (err instanceof Error) throw new Error(err.message);
  }
};
