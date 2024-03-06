import { QueryInterface } from "sequelize";

const users = [
  {
    id: 1,
    email: "peterihimire@gmail.com",
    acct_id: "8474893029",
    password: "testing123",
    createdAt: "2023-06-25 19:38:02.415+01",
    updatedAt: "2023-06-25 19:38:02.415+01",
  },
  {
    id: 2,
    email: "mariaihimire@gmail.com",
    acct_id: "8474811119",
    password: "testing123",
    createdAt: "2023-06-25 19:38:02.415+01",
    updatedAt: "2023-06-25 19:38:02.415+01",
  },
];

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> =>
    queryInterface.sequelize.transaction(async (transaction) => {
      // here go all migration changes
      return Promise.all([
        // queryInterface.bulkInsert("feed_types", feedTypes, { transaction }),
        // await queryInterface.bulkInsert("users", users, { transaction }),
      ]);
    }),

  down: (queryInterface: QueryInterface): Promise<object | object> =>
    queryInterface.sequelize.transaction(async (transaction) => {
      // here go all migration undo changes
      return Promise.all([
        // queryInterface.bulkDelete("feed_types", null as any, { transaction }),
        // await queryInterface.bulkDelete("users", null as any, { transaction }),
      ]);
    }),
};
