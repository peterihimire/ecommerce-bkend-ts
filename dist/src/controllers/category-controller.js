"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.editCategory = exports.getCategory = exports.getCategories = exports.addCategory = void 0;
const http_status_codes_1 = require("../utils/http-status-codes");
const base_error_1 = __importDefault(require("../utils/base-error"));
const admin_auth_repository_1 = require("../repositories/admin-auth-repository");
const category_repository_1 = require("../repositories/category-repository");
// @route POST api/auth/login
// @desc Login into account
// @access Private
const addCategory = async (req, res, next) => {
    const { admin } = req.session;
    const email = admin === null || admin === void 0 ? void 0 : admin.email;
    const { name, desc } = req.body;
    try {
        const found_admin = await (0, admin_auth_repository_1.foundAdmin)(email);
        if (!found_admin) {
            return next(new base_error_1.default("Admin does not exist!", http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        const found_category = await (0, category_repository_1.foundCategoryName)(name);
        if (found_category) {
            return next(new base_error_1.default("Category title found.", http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        const payload = {
            name: name,
            desc: desc,
        };
        const created_category = await (0, category_repository_1.createCategory)(payload);
        console.log("Created category yes...", created_category);
        const { id, createdAt, updatedAt, ...others } = created_category.dataValues;
        res.status(http_status_codes_1.httpStatusCodes.OK).json({
            status: "success",
            msg: "Category Added!.",
            data: { ...others },
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = http_status_codes_1.httpStatusCodes.INTERNAL_SERVER;
        }
        next(error);
    }
};
exports.addCategory = addCategory;
// @route POST api/auth/login
// @desc Login into account
// @access Private
const getCategories = async (req, res, next) => {
    try {
        const found_categories = await (0, category_repository_1.foundCategories)();
        console.log("This are the found categories....", found_categories);
        res.status(http_status_codes_1.httpStatusCodes.OK).json({
            status: "success",
            msg: "All Categories!.",
            data: found_categories,
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = http_status_codes_1.httpStatusCodes.INTERNAL_SERVER;
        }
        next(error);
    }
};
exports.getCategories = getCategories;
// @route POST api/auth/login
// @desc Login into account
// @access Private
const getCategory = async (req, res, next) => {
    const { cat_id } = req.params;
    try {
        const found_category = await (0, category_repository_1.foundCategoryId)(cat_id);
        console.log("This are the found categorys....", found_category);
        res.status(http_status_codes_1.httpStatusCodes.OK).json({
            status: "success",
            msg: "Category info!.",
            data: found_category,
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = http_status_codes_1.httpStatusCodes.INTERNAL_SERVER;
        }
        next(error);
    }
};
exports.getCategory = getCategory;
// @route POST api/auth/login
// @desc Login into account
// @access Private
const editCategory = async (req, res, next) => {
    const { admin } = req.session;
    const { cat_id } = req.params;
    const email = admin === null || admin === void 0 ? void 0 : admin.email;
    const { name, desc } = req.body;
    try {
        const found_admin = await (0, admin_auth_repository_1.foundAdmin)(email);
        if (!found_admin) {
            return next(new base_error_1.default("Admin does not exist!", http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        const found_category = await (0, category_repository_1.foundCategoryId)(cat_id);
        console.log("This is found category....", found_category);
        const payload = {
            name: name,
            desc: desc,
        };
        const updated_category = await (0, category_repository_1.updateCategoryId)(cat_id, payload);
        console.log("Updated category yes...", updated_category);
        const { id, createdAt, updatedAt, ...others } = updated_category.dataValues;
        res.status(http_status_codes_1.httpStatusCodes.OK).json({
            status: "success",
            msg: "Category updated!.",
            data: { ...others },
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = http_status_codes_1.httpStatusCodes.INTERNAL_SERVER;
        }
        next(error);
    }
};
exports.editCategory = editCategory;
// @route POST api/auth/login
// @desc Login into account
// @access Private
const deleteCategory = async (req, res, next) => {
    const { admin } = req.session;
    const { cat_id } = req.params;
    const email = admin === null || admin === void 0 ? void 0 : admin.email;
    try {
        const found_admin = await (0, admin_auth_repository_1.foundAdmin)(email);
        if (!found_admin) {
            return next(new base_error_1.default("Admin does not exist!", http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        await (0, category_repository_1.deleteCategoryId)(cat_id);
        res.status(http_status_codes_1.httpStatusCodes.OK).json({
            status: "success",
            msg: "Category deleted.",
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = http_status_codes_1.httpStatusCodes.INTERNAL_SERVER;
        }
        next(error);
    }
};
exports.deleteCategory = deleteCategory;
