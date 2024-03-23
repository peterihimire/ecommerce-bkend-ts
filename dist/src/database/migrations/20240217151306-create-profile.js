"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
        // here go all migration changes
        await queryInterface.createTable("profiles", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: sequelize_1.DataTypes.INTEGER,
            },
            first_name: {
                type: sequelize_1.DataTypes.STRING,
            },
            last_name: {
                type: sequelize_1.DataTypes.STRING,
            },
            title: {
                type: sequelize_1.DataTypes.STRING,
            },
            acct_id: {
                type: sequelize_1.DataTypes.STRING,
            },
            phone: {
                type: sequelize_1.DataTypes.STRING,
            },
            gender: {
                type: sequelize_1.DataTypes.STRING,
            },
            picture: {
                type: sequelize_1.DataTypes.STRING,
            },
            is_verified: {
                type: sequelize_1.DataTypes.BOOLEAN,
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
        await queryInterface.dropTable("profiles");
    }),
};
