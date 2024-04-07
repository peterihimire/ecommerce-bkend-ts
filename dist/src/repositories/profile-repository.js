"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProfile = void 0;
const models_1 = __importDefault(require("../database/models"));
const Profile = models_1.default.Profile;
const createProfile = async (data) => {
    return Profile.create({
        acct_id: data.acct_id,
        userId: data.userId,
    });
};
exports.createProfile = createProfile;
