"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const base_error_1 = __importDefault(require("./utils/base-error"));
const http_status_codes_1 = require("./utils/http-status-codes");
const redis_client_1 = require("./utils/redis-client");
const onboard_route_1 = __importDefault(require("./routes/onboard-route"));
const auth_route_1 = __importDefault(require("./routes/auth-route"));
const admin_auth_route_1 = __importDefault(require("./routes/admin-auth-route"));
const product_route_1 = __importDefault(require("./routes/product-route"));
const cart_route_1 = __importDefault(require("./routes/cart-route"));
const order_route_1 = __importDefault(require("./routes/order-route"));
const test_route_1 = __importDefault(require("./routes/test-route"));
const error_handler_1 = require("./middlewares/error-handler");
const connect_redis_1 = __importDefault(require("connect-redis"));
const file_storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // console.log("🚀 ~ file: upload.ts:11 ~ file", process.cwd());
        cb(null, "documents/image");
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split(".").pop();
        cb(null, file.originalname.split(".")[0] +
            "-" +
            new Date().toISOString() +
            "." +
            ext);
        // cb(null, new Date().toISOString() + "-" + file.originalname);
    },
});
const file_filter = (req, file, cb) => {
    const fileSize = parseInt(req.headers["content-length"]);
    console.log("This si req file size", fileSize);
    if (fileSize > 500000) {
        cb(new base_error_1.default("Images must be under 500kb!", http_status_codes_1.httpStatusCodes.UNPROCESSABLE_ENTITY), false);
    }
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    }
    else {
        cb(new base_error_1.default("Only images are allowed!", http_status_codes_1.httpStatusCodes.UNPROCESSABLE_ENTITY), false);
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
const multerOptions = (0, multer_1.default)({
    storage: file_storage,
    limits: { fileSize: 500000 },
    fileFilter: file_filter,
}).array("images", 3);
let redisStoreOne = new connect_redis_1.default({
    client: redis_client_1.redisclient,
    prefix: "ecommerce_user",
});
let redisStoreTwo = new connect_redis_1.default({
    client: redis_client_1.redisclient,
    prefix: "ecommerce_admin",
});
let redisStoreCart = new connect_redis_1.default({
    client: redis_client_1.redisclient,
    prefix: "ecommerce_cart",
});
let redisStoreOnboard = new connect_redis_1.default({
    client: redis_client_1.redisclient,
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
const app = (0, express_1.default)();
app.set("trust proxy", 1);
// MIDDLEWARES
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(multerOptions);
// Define the path to serve static files for the TypeScript code
app.use("/documents/pdf", express_1.default.static(path_1.default.join(__dirname, "../documents/pdf")));
app.use("/documents/image", express_1.default.static(path_1.default.join(__dirname, "../documents/image")));
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
app.use("/api/ecommerce/v1/onboard", (0, express_session_1.default)(sessionOptionsFour), onboard_route_1.default);
app.use("/api/ecommerce/v1/admins/auth", (0, express_session_1.default)(sessionOptionsTwo), admin_auth_route_1.default);
app.use("/api/ecommerce/v1/auth", (0, express_session_1.default)(sessionOptions), auth_route_1.default);
app.use("/api/ecommerce/v1/products", (0, express_session_1.default)(sessionOptionsTwo), product_route_1.default);
app.use("/api/ecommerce/v1/carts", (0, express_session_1.default)(sessionOptions), cart_route_1.default);
app.use("/api/ecommerce/v1/orders", (0, express_session_1.default)(sessionOptions), order_route_1.default);
app.use("/api/ecommerce/v1/test", test_route_1.default);
app.use(error_handler_1.unknownRoute);
app.use(error_handler_1.logErrorMiddleware);
app.use(error_handler_1.returnError);
exports.default = app;
// "scripts": {
//   "test": "jest",
//   "dev": "nodemon dist/index.js",
//   "migr": "sequelize db:migrate && nodemon dist/index.js",
//   "seed": "sequelize db:migrate && sequelize db:seed:all && nodemon dist/index.js",
//   "start": "node dist/index.js",
//   "migrate": "sequelize db:migrate && node dist/index.js",
//   "seeder": "sequelize db:migrate && sequelize db:seed:all && node dist/index.js"
// },
