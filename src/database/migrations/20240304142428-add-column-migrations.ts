"use strict";

import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: any) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        "profiles",
        "userId",
        {
          type: DataTypes.INTEGER,
          references: { model: "users", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        { transaction }
      );

      await queryInterface.addColumn(
        "carts",
        "userId",
        {
          type: DataTypes.INTEGER,
          references: { model: "users", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        { transaction }
      );

      await queryInterface.addColumn(
        "orders",
        "userId",
        {
          type: DataTypes.INTEGER,
          references: { model: "users", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
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
      await queryInterface.removeColumn("profiles", "userId", {
        transaction,
      });

      await queryInterface.removeColumn("carts", "userId", {
        transaction,
      });
      
      await queryInterface.removeColumn("orders", "userId", {
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.log(error);
    }
  },
};
