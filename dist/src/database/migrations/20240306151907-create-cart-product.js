"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
        // here go all migration changes
        await queryInterface.createTable("cart_products", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: sequelize_1.DataTypes.INTEGER,
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
            title: {
                type: sequelize_1.DataTypes.STRING,
            },
            price: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
            },
            quantity: {
                type: sequelize_1.DataTypes.INTEGER,
            },
            addedBy: {
                type: sequelize_1.DataTypes.STRING,
            },
            addedAt: {
                type: sequelize_1.DataTypes.DATE,
            },
            uuid: {
                type: sequelize_1.DataTypes.STRING,
            },
            cartId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "carts", // This should be the name of the Cart model/table
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            productId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "products", // This should be the name of the Product model/table
                    key: "id",
                },
                onDelete: "CASCADE",
            },
        });
    }),
    down: (queryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
        // here go all migration undo changes
        await queryInterface.dropTable("cart_products");
    }),
};
