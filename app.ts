import express, { Application } from "express";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as redis from "redis";
import RedisStore from "connect-redis";

import authRoute from "./src/routes/auth-route";
import testRoute from "./src/routes/test-route";
import {
  logErrorMiddleware,
  returnError,
  unknownRoute,
} from "./src/middlewares/error-handler";

let redisclient = redis.createClient({
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
  console.log("Redis client is ready!");
});

redisclient.on("connect", function () {
  console.log("Redis client connected...");
});

redisclient.on("error", (err) => {
  console.log("Error in the connection!");
});

let redisStore = new (RedisStore as any)({
  client: redisclient,
  prefix: "ecommerce_store",
});

const corsOptions = {
  origin: ["*", "http://localhost:3020"],
  methods: ["*"],
  allowedHeaders: ["*"],
  credentials: true,
  optionSuccessStatus: 200,
};

const sessionOptions = {
  // store: new RedisStore({ client: redisClient }),
  store: redisStore,
  secret: String(process.env.SESSION_SECRET),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // if true only transmit cookie over https
    httpOnly: false, // if true prevent client side JS from reading the cookie
    maxAge: 1000 * 60 * 60, // session max age in miliseconds
  },
};

const app: Application = express();
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.set("trust proxy", 1);
app.use("/api/ecommerce/v1/auth", session(sessionOptions), authRoute);
app.use("/api/ecommerce/v1/test", testRoute);

app.use(unknownRoute);
app.use(logErrorMiddleware);
app.use(returnError);
export default app;
