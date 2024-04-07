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
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
        // here go all migration changes
        await queryInterface.createTable("order_products", {
            // id: {
            //   allowNull: false,
            //   autoIncrement: true,
            //   primaryKey: true,
            //   type: DataTypes.INTEGER,
            // },
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
            title: {
                type: sequelize_1.DataTypes.STRING,
            },
            price: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
            },
            quantity: {
                type: sequelize_1.DataTypes.INTEGER,
            },
            uuid: {
                type: sequelize_1.DataTypes.STRING,
            },
            orderId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "orders",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            productId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "products",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
        });
    }),
    down: (queryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
        // here go all migration undo changes
        await queryInterface.dropTable("order_products");
    }),
};
