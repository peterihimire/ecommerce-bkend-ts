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
                type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT), // Change to ARRAY type
            },
            colors: {
                type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING), // Change to ARRAY type
            },
            categories: {
                type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING), // Change to ARRAY type
            },
            price: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
            },
            brand: {
                type: sequelize_1.DataTypes.STRING,
            },
            countInStock: {
                type: sequelize_1.DataTypes.INTEGER,
            },
            rating: {
                type: sequelize_1.DataTypes.FLOAT, // Change to DataTypes.FLOAT if rating can be decimal
            },
            desc: {
                type: sequelize_1.DataTypes.STRING,
            },
            sizes: {
                type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING), // Change to ARRAY type
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
