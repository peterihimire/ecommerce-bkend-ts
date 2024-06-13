import express, { Application, Request } from "express";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import passport from "passport";
import configurePassport from "./middlewares/passport";
import { CustomUser, Admin, Client, PassportUser } from "./types/types";
import { redisclient } from "./utils/redis-client";
import onboardRoute from "./routes/onboard-route";
import authRoute from "./routes/auth-route";
import adminAuthRoute from "./routes/admin-auth-route";
import userRoute from "./routes/user-route";
import productRoute from "./routes/product-route";
import cartRoute from "./routes/cart-route";
import orderRoute from "./routes/order-route";
import categoryRoute from "./routes/category-route";
import reviewRoute from "./routes/review-route";
import testRoute from "./routes/test-route";
import {
  logErrorMiddleware,
  returnError,
  unknownRoute,
} from "./middlewares/error-handler";
import RedisStore from "connect-redis";
configurePassport(passport);

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
    //For CustomUser and Admin I used the imported types
    passport: PassportUser;
    user: CustomUser;
    admin: Admin;
    cart: Cart;
    client: Client;
  }
}

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
  saveUninitialized: true,
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
// app.use(multerOptions);
// app.use(picOptions);

// Define the path to serve static files for the TypeScript code
app.use(
  "/documents/pdf",
  express.static(path.join(__dirname, "../documents/pdf"))
);

app.use(
  "/documents/image",
  express.static(path.join(__dirname, "../documents/image"))
);

app.use(
  "/documents/picture",
  express.static(path.join(__dirname, "../documents/picture"))
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
// const staticPathPdf = path.join(__dirname, "../..", "documents", "pdf");
// const staticPathPicture = path.join(__dirname, "../..", "documents", "picture");
// const staticPathImage = path.join(__dirname, "../..", "documents", "image");

// // Serve static files from the specified directory
// app.use("/documents/pdf", express.static(staticPathPdf));
// app.use("/documents/picture", express.static(staticPathPicture));
// app.use("/documents/image", express.static(staticPathImage));

app.use("/api/ecommerce/v1/onboard", session(sessionOptionsFour), onboardRoute);
app.use(
  "/api/ecommerce/v1/admins/auth",
  session(sessionOptionsTwo),
  adminAuthRoute
);
app.use(
  "/api/ecommerce/v1/auth",
  session(sessionOptions),
  passport.initialize(),
  passport.session(),
  authRoute
);
// app.use("/api/ecommerce/v1/auth", session(sessionOptions), authRoute);
app.use(
  "/api/ecommerce/v1/users",
  session(sessionOptions),
  passport.initialize(),
  passport.session(),
  userRoute
);
app.use("/api/ecommerce/v1/products", session(sessionOptionsTwo), productRoute);
app.use(
  "/api/ecommerce/v1/carts",
  session(sessionOptions),
  passport.initialize(),
  passport.session(),
  cartRoute
);
app.use(
  "/api/ecommerce/v1/orders",
  session(sessionOptions),
  passport.initialize(),
  passport.session(),
  orderRoute
);
app.use(
  "/api/ecommerce/v1/categories",
  session(sessionOptionsTwo),
  categoryRoute
);
app.use(
  "/api/ecommerce/v1/reviews",
  session(sessionOptions),
  passport.initialize(),
  passport.session(),
  reviewRoute
);
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
