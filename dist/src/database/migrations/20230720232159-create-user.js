"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
        // here go all migration changes
        await queryInterface.createTable("users", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: sequelize_1.DataTypes.INTEGER,
            },
            email: {
                type: sequelize_1.DataTypes.STRING,
            },
            first_name: {
                type: sequelize_1.DataTypes.STRING,
            },
            last_name: {
                type: sequelize_1.DataTypes.STRING,
            },
            phone: {
                type: sequelize_1.DataTypes.STRING,
            },
            acct_id: {
                type: sequelize_1.DataTypes.STRING,
            },
            password: {
                type: sequelize_1.DataTypes.STRING,
            },
            createdAt: {
                allowNull: false,
                type: sequelize_1.DataTypes.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: sequelize_1.DataTypes.DATE,
            },
        });
    }),
    down: (queryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
        // here go all migration undo changes
        await queryInterface.dropTable("users");
    }),
};
