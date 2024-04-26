import express, { Application, Request } from "express";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";
import { User, Admin, Client } from "./types/types";
import BaseError from "./utils/base-error";
import { httpStatusCodes } from "./utils/http-status-codes";
import { redisclient } from "./utils/redis-client";
import onboardRoute from "./routes/onboard-route";
import authRoute from "./routes/auth-route";
import adminAuthRoute from "./routes/admin-auth-route";
import productRoute from "./routes/product-route";
import cartRoute from "./routes/cart-route";
import orderRoute from "./routes/order-route";
import testRoute from "./routes/test-route";
import {
  logErrorMiddleware,
  returnError,
  unknownRoute,
} from "./middlewares/error-handler";
import RedisStore from "connect-redis";

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
    //For User and Admin I used the imported types
    user: User;
    admin: Admin;
    cart: Cart;
    client: Client;
  }
}

const file_storage = multer.diskStorage({
  destination: (req: Request, file: any, cb: Function) => {
    // console.log("🚀 ~ file: upload.ts:11 ~ file", process.cwd());
    cb(null, "documents/image");
  },
  filename: (req: Request, file: any, cb: Function) => {
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

const multerOptions = multer({
  storage: file_storage,
  limits: { fileSize: 500000 },
  fileFilter: file_filter,
}).array("images", 3);

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

let redisStoreOnboard = new (RedisStore as any)({
  client: redisclient,
  prefix: "ecommerce_onboard",
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
const sessionOptionsFour = {
  // store: new RedisStore({ client: redisClient }),
  store: redisStoreOnboard,
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
app.use(multerOptions);

// Define the path to serve static files for the TypeScript code
app.use(
  "/documents/pdf",
  express.static(path.join(__dirname, "../documents/pdf"))
);

app.use(
  "/documents/image",
  express.static(path.join(__dirname, "../documents/image"))
);

// // Serve frontend
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../frontend/build')));

//   app.get('*', (req, res) =>
//     res.sendFile(
//       path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
//     )
//   );
// } else {
//   app.get('/', (req, res) => res.send('Please set to production'));
// }

// // Define the path to serve static files for the compiled JavaScript code
// const staticPath = path.join(__dirname, "../..", "documents", "pdf");

// // Serve static files from the specified directory
// app.use("/documents/pdf", express.static(staticPath));

app.use("/api/ecommerce/v1/onboard", session(sessionOptionsFour), onboardRoute);
app.use(
  "/api/ecommerce/v1/admins/auth",
  session(sessionOptionsTwo),
  adminAuthRoute
);
app.use("/api/ecommerce/v1/auth", session(sessionOptions), authRoute);
app.use("/api/ecommerce/v1/products", session(sessionOptionsTwo), productRoute);
app.use("/api/ecommerce/v1/carts", session(sessionOptions), cartRoute);
app.use("/api/ecommerce/v1/orders", session(sessionOptions), orderRoute);
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
