"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = __importDefault(require("../database/models"));
const User = models_1.default.User;
const Transaction = models_1.default.Transaction;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
