"use strict";

import { QueryInterface, DataTypes, QueryTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.sequelize.transaction(async (transaction) => {
      // here go all migration changes
      await queryInterface.createTable("profiles", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        first_name: {
          type: DataTypes.STRING,
        },
        last_name: {
          type: DataTypes.STRING,
        },
        title: {
          type: DataTypes.STRING,
        },
        acct_id: {
          type: DataTypes.STRING,
        },
        phone: {
          type: DataTypes.STRING,
        },
        gender: {
          type: DataTypes.STRING,
        },
        picture: {
          type: DataTypes.STRING,
        },
        is_verified: {
          type: DataTypes.BOOLEAN,
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
      await queryInterface.dropTable("profiles");
    }),
};
