"use strict";

import { QueryInterface, DataTypes, QueryTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.sequelize.transaction(async (transaction) => {
      // here go all migration changes
      await queryInterface.createTable("transactions", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        acct_id: {
          type: DataTypes.STRING,
        },
        payment_method: {
          type: DataTypes.STRING,
        },
        transaction_ref: {
          type: DataTypes.STRING,
        },
        amount: {
          type: DataTypes.DECIMAL(10, 2),
        },
        currency: {
          type: DataTypes.STRING,
        },
        payment_status: {
          type: DataTypes.STRING,
        },
        payment_gateway: {
          type: DataTypes.STRING,
        },
        is_successful: {
          type: DataTypes.BOOLEAN,
        },
        is_verified: {
          type: DataTypes.BOOLEAN,
        },
        transaction_id: {
          type: DataTypes.STRING,
        },
        refund: {
          type: DataTypes.DECIMAL(10, 2),
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
      await queryInterface.dropTable("transactions");
    }),
};

