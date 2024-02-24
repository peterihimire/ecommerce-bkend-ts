import * as redis from "redis";
import { promisify } from "util";

const { createClient } = redis;
const redisclient = createClient({
  legacyMode: false,
  socket: {
    port: Number(process.env.REDIS_PORT),
    host: process.env.REDIS_URL,
  },
});

(async () => {
  await redisclient.connect();
})();

redisclient.on("ready", () => {
  console.log("Redis database is ready!");
});

redisclient.on("connect", function () {
  console.log("Redis database connected...");
});

redisclient.on("error", (err: any) => {
  console.log("Error in the connection!", err);
});

const getAsync = promisify(redisclient.get).bind(redisclient);
const setAsync = promisify(redisclient.set).bind(redisclient);

export { redisclient, getAsync, setAsync };
