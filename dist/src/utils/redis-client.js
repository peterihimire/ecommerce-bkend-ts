"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAsync = exports.getAsync = exports.redisclient = void 0;
const redis = __importStar(require("redis"));
const util_1 = require("util");
const { createClient } = redis;
const redisclient = createClient({
    legacyMode: false,
    socket: {
        port: Number(process.env.REDIS_PORT),
        host: process.env.REDIS_HOST,
    },
});
exports.redisclient = redisclient;
(async () => {
    await redisclient.connect();
})();
redisclient.on("ready", () => {
    console.log("Redis database is ready!");
});
redisclient.on("connect", function () {
    console.log("Redis database connected...");
});
redisclient.on("error", (err) => {
    console.log("Error in the connection!", err);
});
const getAsync = (0, util_1.promisify)(redisclient.get).bind(redisclient);
exports.getAsync = getAsync;
const setAsync = (0, util_1.promisify)(redisclient.set).bind(redisclient);
exports.setAsync = setAsync;
