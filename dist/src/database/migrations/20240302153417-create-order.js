"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
        // here go all migration changes
        await queryInterface.createTable("orders", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: sequelize_1.DataTypes.INTEGER,
            },
            uuid: {
                type: sequelize_1.DataTypes.STRING,
            },
            totalQty: {
                type: sequelize_1.DataTypes.INTEGER,
            },
            totalPrice: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
            },
            address: {
                type: sequelize_1.DataTypes.STRING,
            },
            status: {
                defaultValue: "pending",
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
        await queryInterface.dropTable("orders");
    }),
};
