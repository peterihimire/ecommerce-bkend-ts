// 'use strict';
// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up(queryInterface, Sequelize) {
//     await queryInterface.createTable('OrderProducts', {
//       id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: Sequelize.INTEGER
//       },
//       title: {
//         type: Sequelize.STRING
//       },
//       price: {
//         type: Sequelize.STRING
//       },
//       quantity: {
//         type: Sequelize.NUMBER
//       },
//       uuid: {
//         type: Sequelize.STRING
//       },
//       orderId: {
//         type: Sequelize.NUMBER
//       },
//       productId: {
//         type: Sequelize.NUMBER
//       },
//       createdAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       },
//       updatedAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       }
//     });
//   },
//   async down(queryInterface, Sequelize) {
//     await queryInterface.dropTable('OrderProducts');
//   }
// };

"use strict";

import { QueryInterface, DataTypes, QueryTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.sequelize.transaction(async (transaction) => {
      // here go all migration changes
      await queryInterface.createTable("order_products", {
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
        uuid: {
          type: DataTypes.STRING,
        },
        orderId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "orders", // This should be the name of the Oder model/table
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
      await queryInterface.dropTable("order_products");
    }),
};
