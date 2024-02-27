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
          type: DataTypes.STRING,
        },
        colors: {
          type: DataTypes.STRING,
        },
        categories: {
          type: DataTypes.STRING,
        },
        price: {
          type: DataTypes.DECIMAL,
        },
        brand: {
          type: DataTypes.STRING,
        },
        countInStock: {
          type: DataTypes.INTEGER,
        },
        rating: {
          type: DataTypes.INTEGER,
        },
        desc: {
          type: DataTypes.STRING,
        },
        sizes: {
          type: DataTypes.STRING,
        },
        numReviews: {
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
