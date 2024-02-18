"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.addColumn("profiles", "userId", {
                type: sequelize_1.DataTypes.INTEGER,
                references: { model: "users", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
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
            await queryInterface.removeColumn("profiles", "userId", {
                transaction,
            });
            await transaction.commit();
        }
        catch (error) {
            await transaction.rollback();
            console.log(error);
        }
    },
};
