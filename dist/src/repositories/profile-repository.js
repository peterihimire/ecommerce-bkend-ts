"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.foundProfile = exports.createProfile = void 0;
const models_1 = __importDefault(require("../database/models"));
const Profile = models_1.default.Profile;
const createProfile = async (data) => {
    return Profile.create({
        acct_id: data.acct_id,
        userId: data.userId,
    });
};
exports.createProfile = createProfile;
const foundProfile = async (acct_id) => {
    return Profile.findOne({
        where: { acct_id: acct_id },
    });
};
exports.foundProfile = foundProfile;
const updateProfile = async (acct_id, data) => {
    console.log("This is data putu...", data);
    const updated_profile = await (0, exports.foundProfile)(acct_id);
    console.log("This is the update product...", updated_profile);
    // Update the product fields if they are provided in the data
    if (data.title !== undefined) {
        updated_profile.title = data.title;
    }
    if (data.first_name !== undefined) {
        updated_profile.first_name = data.first_name;
    }
    if (data.last_name !== undefined) {
        updated_profile.last_name = data.last_name;
    }
    if (data.gender !== undefined) {
        updated_profile.gender = data.gender;
    }
    if (data.phone !== undefined) {
        updated_profile.phone = data.phone;
    }
    return updated_profile.save();
};
exports.updateProfile = updateProfile;
