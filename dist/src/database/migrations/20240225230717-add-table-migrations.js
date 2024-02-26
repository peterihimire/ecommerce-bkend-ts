"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable("admin_roles", {
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
                adminId: {
                    type: sequelize_1.DataTypes.INTEGER,
                    primaryKey: true,
                },
                roleId: {
                    type: sequelize_1.DataTypes.INTEGER,
                    primaryKey: true,
                },
            }, { transaction });
            await transaction.commit();
        }
        catch (error) {
            await transaction.rollback();
            console.log(error);
        }
    },
    async down(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.dropTable("admin_roles", { transaction });
            await transaction.commit();
        }
        catch (error) {
            await transaction.rollback();
            console.log(error);
        }
    },
};
