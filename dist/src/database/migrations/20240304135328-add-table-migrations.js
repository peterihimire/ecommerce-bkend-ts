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
            // await queryInterface.createTable(
            //   "cart_products",
            //   {
            //     createdAt: {
            //       allowNull: false,
            //       defaultValue: new Date(),
            //       type: DataTypes.DATE,
            //     },
            //     updatedAt: {
            //       allowNull: false,
            //       defaultValue: new Date(),
            //       type: DataTypes.DATE,
            //     },
            //     quantity: {
            //       type: DataTypes.INTEGER,
            //     },
            //     addedBy: {
            //       type: DataTypes.STRING,
            //     },
            //     addedAt: {
            //       defaultValue: new Date(),
            //       type: DataTypes.DATE,
            //     },
            //     uuid: {
            //       type: DataTypes.STRING,
            //     },
            // cartId: {
            //   type: DataTypes.INTEGER,
            //   primaryKey: true,
            // },
            // productId: {
            //   type: DataTypes.INTEGER,
            //   primaryKey: true,
            // },
            //   },
            //   { transaction }
            // );
            await queryInterface.createTable("order_products", {
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
                quantity: {
                    type: sequelize_1.DataTypes.INTEGER,
                },
                amount: {
                    type: sequelize_1.DataTypes.DECIMAL(10, 2),
                },
                address: {
                    type: sequelize_1.DataTypes.STRING,
                },
                status: {
                    defaultValue: "pending",
                    type: sequelize_1.DataTypes.STRING,
                },
                uuid: {
                    type: sequelize_1.DataTypes.STRING,
                },
                orderId: {
                    type: sequelize_1.DataTypes.INTEGER,
                    primaryKey: true,
                },
                productId: {
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
            // await queryInterface.dropTable("cart_products", { transaction });
            await queryInterface.dropTable("order_products", { transaction });
            await transaction.commit();
        }
        catch (error) {
            await transaction.rollback();
            console.log(error);
        }
    },
};
