import express, { Application, Request } from "express";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";

import BaseError from "./src/utils/base-error";
import { httpStatusCodes } from "./src/utils/http-status-codes";

import { redisclient } from "./src/utils/redis-client";

import authRoute from "./src/routes/auth-route";
import adminAuthRoute from "./src/routes/admin-auth-route";
import productRoute from "./src/routes/product-route";
import cartRoute from "./src/routes/cart-route";
import testRoute from "./src/routes/test-route";
import {
  logErrorMiddleware,
  returnError,
  unknownRoute,
} from "./src/middlewares/error-handler";
import RedisStore from "connect-redis";

// This works with the verify-session file
type User = {
  id: string;
  email: string;
};

type Admin = {
  id: string;
  email: string;
};

type Cart = {
  userId: string | null;
  cartId: string;
  products: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalQty: number;
  totalPrice: number;
};

// Augment express-session with a custom SessionData object
declare module "express-session" {
  interface SessionData {
    user: User;
    admin: Admin;
    cart: Cart;
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

let redisStoreOne = new (RedisStore as any)({
  client: redisclient,
  prefix: "ecommerce_user",
});

let redisStoreTwo = new (RedisStore as any)({
  client: redisclient,
  prefix: "ecommerce_admin",
});

let redisStoreCart = new (RedisStore as any)({
  client: redisclient,
  prefix: "ecommerce_cart",
});

const sessionOptions = {
  // store: new RedisStore({ client: redisClient }),
  store: redisStoreOne,
  secret: String(process.env.SESSION_SECRET),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // if true only transmit cookie over https
    httpOnly: true, // if true prevent client side JS from reading the cookie
    maxAge: 1000 * 60 * 60 * 12, // session max age in miliseconds
    // sameSite: "none",
  },
};

const sessionOptionsTwo = {
  // store: new RedisStore({ client: redisClient }),
  store: redisStoreTwo,
  secret: String(process.env.ADMIN_SESSION_SECRET),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // if true only transmit cookie over https
    httpOnly: true, // if true prevent client side JS from reading the cookie
    maxAge: 1000 * 60 * 60 * 12, // session max age in miliseconds
    // sameSite: "none",
  },
};

const sessionOptionsThree = {
  // store: new RedisStore({ client: redisClient }),
  store: redisStoreCart,
  secret: String(process.env.SESSION_SECRET),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // if true only transmit cookie over https
    httpOnly: true, // if true prevent client side JS from reading the cookie
    maxAge: 1000 * 60 * 60 * 12, // session max age in miliseconds
    // sameSite: "none",
  },
};

const app: Application = express();
app.set("trust proxy", 1);

// MIDDLEWARES
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use(
  "/api/ecommerce/v1/admins/auth",
  session(sessionOptionsTwo),
  adminAuthRoute
);
app.use("/api/ecommerce/v1/auth", session(sessionOptions), authRoute);
app.use("/api/ecommerce/v1/products", session(sessionOptionsTwo), productRoute);
app.use("/api/ecommerce/v1/carts", session(sessionOptions), cartRoute);
app.use("/api/ecommerce/v1/test", testRoute);

app.use(unknownRoute);
app.use(logErrorMiddleware);
app.use(returnError);
export default app;
  // "scripts": {
  //   "test": "jest",
  //   "dev": "nodemon dist/index.js",
  //   "migr": "sequelize db:migrate && nodemon dist/index.js",
  //   "seed": "sequelize db:migrate && sequelize db:seed:all && nodemon dist/index.js",
  //   "start": "node dist/index.js",
  //   "migrate": "sequelize db:migrate && node dist/index.js",
  //   "seeder": "sequelize db:migrate && sequelize db:seed:all && node dist/index.js"
  // },