"use strict";

import { QueryInterface, DataTypes, QueryTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.sequelize.transaction(async (transaction) => {
      // here go all migration changes
      await queryInterface.createTable("cart_products", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
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
        title: {
          type: DataTypes.STRING,
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
        },
        quantity: {
          type: DataTypes.INTEGER,
        },
        addedBy: {
          type: DataTypes.STRING,
        },
        addedAt: {
          type: DataTypes.DATE,
        },
        uuid: {
          type: DataTypes.STRING,
        },
        cartId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "carts", // This should be the name of the Cart model/table
            key: "id",
          },
          onDelete: "CASCADE",
        },
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "products", // This should be the name of the Product model/table
            key: "id",
          },
          onDelete: "CASCADE",
        },
      });
    }),

  down: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.sequelize.transaction(async (transaction) => {
      // here go all migration undo changes
      await queryInterface.dropTable("cart_products");
    }),
};
