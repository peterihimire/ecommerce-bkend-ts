"use strict";

import { QueryInterface, DataTypes, QueryTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.sequelize.transaction(async (transaction) => {
      // here go all migration changes
      await queryInterface.createTable("loginaudits", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        user: {
          type: DataTypes.STRING,
        },
        ip_address: {
          type: DataTypes.STRING,
        },
        action: {
          type: DataTypes.STRING,
        },
        status: {
          type: DataTypes.STRING,
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
      });
    }),

  down: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.sequelize.transaction(async (transaction) => {
      // here go all migration undo changes
      await queryInterface.dropTable("loginaudits");
    }),
};

