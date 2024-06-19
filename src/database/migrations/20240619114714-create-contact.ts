"use strict";

import { QueryInterface, DataTypes, QueryTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.sequelize.transaction(async (transaction) => {
      // here go all migration changes
      await queryInterface.createTable("contacts", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        fullname: {
          type: DataTypes.STRING,
        },
        company: {
          type: DataTypes.STRING,
        },
        email: {
          type: DataTypes.STRING,
        },
        phone: {
          type: DataTypes.STRING,
        },
        subject: {
          type: DataTypes.STRING,
        },
        message: {
          type: DataTypes.STRING,
        },
        uuid: {
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
      await queryInterface.dropTable("contacts");
    }),
};

// 'use strict';
// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up(queryInterface, Sequelize) {
//     await queryInterface.createTable('Contacts', {
      // id: {
      //   allowNull: false,
      //   autoIncrement: true,
      //   primaryKey: true,
      //   type: Sequelize.INTEGER
      // },
      // fullname: {
      //   type: Sequelize.STRING
      // },
      // company: {
      //   type: Sequelize.STRING
      // },
      // email: {
      //   type: Sequelize.STRING
      // },
      // phone: {
      //   type: Sequelize.STRING
      // },
      // subject: {
      //   type: Sequelize.STRING
      // },
      // message: {
      //   type: Sequelize.STRING
      // },
      // createdAt: {
      //   allowNull: false,
      //   type: Sequelize.DATE
      // },
      // updatedAt: {
      //   allowNull: false,
      //   type: Sequelize.DATE
      // }
//     });
//   },
//   async down(queryInterface, Sequelize) {
//     await queryInterface.dropTable('Contacts');
//   }
// };
