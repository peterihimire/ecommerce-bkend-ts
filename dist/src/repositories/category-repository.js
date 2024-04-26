"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoryId = exports.updateCategoryId = exports.createCategory = exports.foundCategoryName = exports.foundCategoryId = exports.foundCategories = void 0;
const models_1 = __importDefault(require("../database/models"));
const Category = models_1.default.Category;
const foundCategories = async () => {
    return Category.findAll({
        attributes: {
            exclude: ["id"],
        },
    });
};
exports.foundCategories = foundCategories;
const foundCategoryId = async (id) => {
    return Category.findOne({
        where: { uuid: id },
    });
};
exports.foundCategoryId = foundCategoryId;
const foundCategoryName = async (name) => {
    return Category.findOne({
        where: { name: name },
    });
};
exports.foundCategoryName = foundCategoryName;
const createCategory = async (data) => {
    return Category.create({
        name: data.name,
        desc: data.desc,
    });
};
exports.createCategory = createCategory;
const updateCategoryId = async (id, data) => {
    console.log("This is data putu...", data);
    const updated_category = await (0, exports.foundCategoryId)(id);
    console.log("This is the update category...", updated_category);
    // Update the product fields if they are provided in the data
    if (data.name !== undefined) {
        updated_category.name = data.name;
    }
    if (data.desc !== undefined) {
        updated_category.desc = data.desc;
    }
    return updated_category.save();
};
exports.updateCategoryId = updateCategoryId;
const deleteCategoryId = async (id) => {
    const deleted_category = await Category.destroy({
        where: {
            uuid: id,
        },
    });
    return deleted_category;
};
exports.deleteCategoryId = deleteCategoryId;
