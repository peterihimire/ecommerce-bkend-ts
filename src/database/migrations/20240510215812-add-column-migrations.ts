"use strict";

import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: any) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Check if the column already exists in the profiles table
      const profilesTable = await queryInterface.describeTable("profiles");
      if (!profilesTable.userId) {
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
      }

      // Check if the column already exists in the carts table
      const cartsTable = await queryInterface.describeTable("carts");
      if (!cartsTable.userId) {
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
      }

      // Check if the column already exists in the orders table
      const ordersTable = await queryInterface.describeTable("orders");
      if (!ordersTable.userId) {
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
      }

      // Check if the column already exists in the transactions table
      const transactionsTable = await queryInterface.describeTable(
        "transactions"
      );
      if (!transactionsTable.userId) {
        await queryInterface.addColumn(
          "transactions",
          "userId",
          {
            type: DataTypes.INTEGER,
            references: { model: "users", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          { transaction }
        );
      }

      // Check if the column already exists in the reviews table
      const reviewsTable = await queryInterface.describeTable("reviews");
      if (!reviewsTable.productId) {
        await queryInterface.addColumn(
          "reviews",
          "productId",
          {
            type: DataTypes.INTEGER,
            references: { model: "products", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          { transaction }
        );
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.log(error);
    }
  },

  async down(queryInterface: QueryInterface, Sequelize: any) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn("profiles", "userId", { transaction });
      await queryInterface.removeColumn("carts", "userId", { transaction });
      await queryInterface.removeColumn("orders", "userId", { transaction });
      await queryInterface.removeColumn("transactions", "userId", {
        transaction,
      });
      await queryInterface.removeColumn("reviews", "productId", {
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.log(error);
    }
  },
};

// "use strict";

// import { QueryInterface, DataTypes } from "sequelize";

// module.exports = {
//   async up(queryInterface: QueryInterface, Sequelize: any) {
//     const transaction = await queryInterface.sequelize.transaction();
//     try {
//       await queryInterface.addColumn(
//         "profiles",
//         "userId",
//         {
//           type: DataTypes.INTEGER,
//           references: { model: "users", key: "id" },
//           onUpdate: "CASCADE",
//           onDelete: "CASCADE",
//         },
//         { transaction }
//       );

//       await queryInterface.addColumn(
//         "carts",
//         "userId",
//         {
//           type: DataTypes.INTEGER,
//           references: { model: "users", key: "id" },
//           onUpdate: "CASCADE",
//           onDelete: "CASCADE",
//         },
//         { transaction }
//       );

//       await queryInterface.addColumn(
//         "orders",
//         "userId",
//         {
//           type: DataTypes.INTEGER,
//           references: { model: "users", key: "id" },
//           onUpdate: "CASCADE",
//           onDelete: "CASCADE",
//         },
//         { transaction }
//       );

//       await queryInterface.addColumn(
//         "transactions",
//         "userId",
//         {
//           type: DataTypes.INTEGER,
//           references: { model: "users", key: "id" },
//           onUpdate: "CASCADE",
//           onDelete: "CASCADE",
//         },
//         { transaction }
//       );

//       await queryInterface.addColumn(
//         "reviews",
//         "productId",
//         {
//           type: DataTypes.INTEGER,
//           references: { model: "products", key: "id" },
//           onUpdate: "CASCADE",
//           onDelete: "CASCADE",
//         },
//         { transaction }
//       );

//       await transaction.commit();
//     } catch (error) {
//       await transaction.rollback();
//       console.log(error);
//     }
//   },

//   async down(queryInterface: QueryInterface, Sequelize: any) {
//     const transaction = await queryInterface.sequelize.transaction();
//     try {
//       await queryInterface.removeColumn("profiles", "userId", {
//         transaction,
//       });

//       await queryInterface.removeColumn("carts", "userId", {
//         transaction,
//       });

//       await queryInterface.removeColumn("orders", "userId", {
//         transaction,
//       });

//       await queryInterface.removeColumn("transactions", "userId", {
//         transaction,
//       });
//       await queryInterface.removeColumn("reviews", "productId", {
//         transaction,
//       });

//       await transaction.commit();
//     } catch (error) {
//       await transaction.rollback();
//       console.log(error);
//     }
//   },
// };
