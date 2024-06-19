"use strict";

import { QueryInterface, DataTypes, QueryTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.sequelize.transaction(async (transaction) => {
      // here go all migration changes
      await queryInterface.createTable("products", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        title: {
          type: DataTypes.STRING,
        },
        slug: {
          type: DataTypes.STRING,
        },
        images: {
          type: DataTypes.ARRAY(DataTypes.TEXT), // Change to ARRAY type
        },
        color: {
          type: DataTypes.STRING,
        },
        categories: {
          type: DataTypes.ARRAY(DataTypes.STRING), // Change to ARRAY type
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
        },
        brand: {
          type: DataTypes.STRING,
        },
        countInStock: {
          type: DataTypes.INTEGER,
        },
        desc: {
          type: DataTypes.STRING,
        },
        size: {
          type: DataTypes.STRING,
        },
        uuid: {
          type: DataTypes.STRING,
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
      });
    }),

  down: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.sequelize.transaction(async (transaction) => {
      // here go all migration undo changes
      await queryInterface.dropTable("products");
    }),
};
