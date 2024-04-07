"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdmin = exports.foundAdmin = void 0;
const models_1 = __importDefault(require("../database/models"));
const Admin = models_1.default.Admin;
const foundAdmin = async (email) => {
    return Admin.findOne({
        where: { email: email },
    });
};
exports.foundAdmin = foundAdmin;
const createAdmin = async (data) => {
    return Admin.create({
        name: data.name,
        user_name: data.user_name,
        email: data.email,
        password: data.password,
        phone: data.phone,
    });
};
exports.createAdmin = createAdmin;
