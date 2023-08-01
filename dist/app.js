"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const redis_1 = __importDefault(require("redis"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const auth_route_1 = __importDefault(require("./src/routes/auth-route"));
const test_route_1 = __importDefault(require("./src/routes/test-route"));
const error_handler_1 = require("./src/middlewares/error-handler");
let redisclient = redis_1.default.createClient({
    legacyMode: false,
    socket: {
        port: process.env.REDIS_PORT,
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
let redisStore = new connect_redis_1.default({
    client: redisclient,
    prefix: "recallo_lite:",
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
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: false,
        maxAge: 1000 * 60 * 60, // session max age in miliseconds
    },
};
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.set("trust proxy", 1);
app.use("/api/ecommerce/v1/auth", auth_route_1.default);
app.use("/api/ecommerce/v1/test", test_route_1.default);
app.use(error_handler_1.unknownRoute);
app.use(error_handler_1.logErrorMiddleware);
app.use(error_handler_1.returnError);
exports.default = app;
