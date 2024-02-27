"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
        // here go all migration changes
        await queryInterface.createTable("products", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: sequelize_1.DataTypes.INTEGER,
            },
            title: {
                type: sequelize_1.DataTypes.STRING,
            },
            slug: {
                type: sequelize_1.DataTypes.STRING,
            },
            images: {
                type: sequelize_1.DataTypes.STRING,
            },
            colors: {
                type: sequelize_1.DataTypes.STRING,
            },
            categories: {
                type: sequelize_1.DataTypes.STRING,
            },
            price: {
                type: sequelize_1.DataTypes.DECIMAL,
            },
            brand: {
                type: sequelize_1.DataTypes.STRING,
            },
            countInStock: {
                type: sequelize_1.DataTypes.INTEGER,
            },
            rating: {
                type: sequelize_1.DataTypes.INTEGER,
            },
            desc: {
                type: sequelize_1.DataTypes.STRING,
            },
            sizes: {
                type: sequelize_1.DataTypes.STRING,
            },
            numReviews: {
                type: sequelize_1.DataTypes.STRING,
            },
            uuid: {
                type: sequelize_1.DataTypes.STRING,
            },
            createdAt: {
                allowNull: false,
                defaultValue: new Date(),
                type: sequelize_1.DataTypes.DATE,
            },
            updatedAt: {
                allowNull: false,
                defaultValue: new Date(),
                type: sequelize_1.DataTypes.DATE,
            },
        });
    }),
    down: (queryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
        // here go all migration undo changes
        await queryInterface.dropTable("products");
    }),
};
