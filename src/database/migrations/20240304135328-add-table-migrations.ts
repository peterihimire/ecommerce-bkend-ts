"use strict";

import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: any) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        "admin_roles",
        {
          createdAt: {
            allowNull: false,
            defaultValue: new Date(),
            type: DataTypes.DATE,
          },
          updatedAt: {
            allowNull: false,
            defaultValue: new Date(),
            type: DataTypes.DATE,
          },
          adminId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
          },
          roleId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
          },
        },
        { transaction }
      );

      await queryInterface.createTable(
        "cart_products",
        {
          createdAt: {
            allowNull: false,
            defaultValue: new Date(),
            type: DataTypes.DATE,
          },
          updatedAt: {
            allowNull: false,
            defaultValue: new Date(),
            type: DataTypes.DATE,
          },
          quantity: {
            allowNull: false,
            type: DataTypes.INTEGER,
          },
          addedBy: {
            type: DataTypes.STRING,
          },
          addedAt: {
            defaultValue: new Date(),
            type: DataTypes.DATE,
          },
          uuid: {
            type: DataTypes.STRING,
          },
          cartId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
          },
          productId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
          },
        },
        { transaction }
      );

      await queryInterface.createTable(
        "order_products",
        {
          createdAt: {
            allowNull: false,
            defaultValue: new Date(),
            type: DataTypes.DATE,
          },
          updatedAt: {
            allowNull: false,
            defaultValue: new Date(),
            type: DataTypes.DATE,
          },
          quantity: {
            allowNull: false,
            type: DataTypes.INTEGER,
          },
          amount: {
            type: DataTypes.DECIMAL(10, 2),
          },
          address: {
            type: DataTypes.STRING,
          },
          status: {
            defaultValue: "pending",
            type: DataTypes.STRING,
          },
          uuid: {
            type: DataTypes.STRING,
          },
          orderId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
          },
          productId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
          },
        },
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.log(error);
    }
  },

  async down(queryInterface: QueryInterface, Sequelize: any) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable("admin_roles", { transaction });
      await queryInterface.dropTable("cart_products", { transaction });
      await queryInterface.dropTable("order_products", { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.log(error);
    }
  },
};
