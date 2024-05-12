"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
        // here go all migration changes
        await queryInterface.createTable("reviews", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: sequelize_1.DataTypes.INTEGER,
            },
            rating: {
                type: sequelize_1.DataTypes.STRING,
            },
            review: {
                type: sequelize_1.DataTypes.STRING,
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
            },
            email: {
                type: sequelize_1.DataTypes.STRING,
            },
            uuid: {
                type: sequelize_1.DataTypes.STRING,
            },
            is_save: {
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
        await queryInterface.dropTable("reviews");
    }),
};
