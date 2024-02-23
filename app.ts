import express, { Application, Request } from "express";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as redis from "redis";
import RedisStore from "connect-redis";

import multer from "multer";
import path from "path";

const BaseError = require("./src/utils/base-error");
const httpStatusCodes = require("./src/utils/http-status-codes");

import authRoute from "./src/routes/auth-route";
import testRoute from "./src/routes/test-route";
import {
  logErrorMiddleware,
  returnError,
  unknownRoute,
} from "./src/middlewares/error-handler";

type User = {
  id: string;
  email: string;
};

// Augment express-session with a custom SessionData object
declare module "express-session" {
  interface SessionData {
    user: User;
  }
}

const file_storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // console.log("🚀 ~ file: upload.ts:11 ~ file", process.cwd());
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(
      null,
      file.originalname.split(".")[0] +
        "-" +
        new Date().toISOString() +
        "." +
        ext
    );
    // cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const file_filter = (req: Request, file: any, cb: Function) => {
  const fileSize = parseInt(req.headers["content-length"] as string);
  console.log("This si req file size", fileSize);
  if (fileSize > 500000) {
    cb(
      new BaseError(
        "Images must be under 500kb!",
        httpStatusCodes.UNPROCESSABLE_ENTITY
      ),
      false
    );
  }
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      new BaseError(
        "Only images are allowed!",
        httpStatusCodes.UNPROCESSABLE_ENTITY
      ),
      false
    );
  }
};

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
  origin: [
    // process.env.CORS_ORIGIN as string,
    "https://silexcms.onrender.com",
    "http://localhost:3000",
    "https://localhost:3000",
  ],
  methods: ["GET", "PUT", "PATCH", "POST", "OPTIONS", "DELETE", "HEAD"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Headers",
    "Origin",
    "Accept",
  ],
  credentials: true,
  optionSuccessStatus: 200,
  preflightContinue: false,
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
