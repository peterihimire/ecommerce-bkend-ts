"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
        // here go all migration changes
        await queryInterface.createTable("transactions", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: sequelize_1.DataTypes.INTEGER,
            },
            acct_id: {
                type: sequelize_1.DataTypes.STRING,
            },
            payment_method: {
                type: sequelize_1.DataTypes.STRING,
            },
            transaction_ref: {
                type: sequelize_1.DataTypes.STRING,
            },
            amount: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
            },
            currency: {
                type: sequelize_1.DataTypes.STRING,
            },
            payment_status: {
                type: sequelize_1.DataTypes.STRING,
            },
            payment_gateway: {
                type: sequelize_1.DataTypes.STRING,
            },
            is_successful: {
                type: sequelize_1.DataTypes.BOOLEAN,
            },
            is_verified: {
                type: sequelize_1.DataTypes.BOOLEAN,
            },
            transaction_id: {
                type: sequelize_1.DataTypes.STRING,
            },
            refund: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
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
        await queryInterface.dropTable("transactions");
    }),
};
