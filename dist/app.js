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
const base_error_1 = __importDefault(require("./src/utils/base-error"));
const http_status_codes_1 = require("./src/utils/http-status-codes");
const redis_client_1 = require("./src/utils/redis-client");
const auth_route_1 = __importDefault(require("./src/routes/auth-route"));
const test_route_1 = __importDefault(require("./src/routes/test-route"));
const error_handler_1 = require("./src/middlewares/error-handler");
const connect_redis_1 = __importDefault(require("connect-redis"));
const file_storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // console.log("🚀 ~ file: upload.ts:11 ~ file", process.cwd());
        cb(null, "images");
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
let redisStoreOne = new connect_redis_1.default({
    client: redis_client_1.redisclient,
    prefix: "ecommerce_store",
});
// const redisStoreTwo = new RedisStore({
//   client: redisclient,
//   prefix: "ecommerce_admin:",
// });
// const redisStoreThree = new RedisStore({
//   client: redisclient,
//   prefix: "ecommerce_reset:",
// });
// const redisStoreFour = new RedisStore({
//   client: redisclient,
//   prefix: "ecommerce_client:",
// });
const sessionOptions = {
    // store: new RedisStore({ client: redisClient }),
    store: redisStoreOne,
    secret: String(process.env.SESSION_SECRET),
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: false,
        maxAge: 1000 * 60 * 60, // session max age in miliseconds
    },
};
const app = (0, express_1.default)();
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.set("trust proxy", 1);
app.use("/api/ecommerce/v1/auth", (0, express_session_1.default)(sessionOptions), auth_route_1.default);
app.use("/api/ecommerce/v1/test", test_route_1.default);
app.use(error_handler_1.unknownRoute);
app.use(error_handler_1.logErrorMiddleware);
app.use(error_handler_1.returnError);
exports.default = app;
