import { QueryInterface } from "sequelize";

const feedTypes = [
  { id: "b871a455-fddb-414c-ac02-2cdee07fa671", name: "crypto" },
  { id: "68b15f90-19ca-4971-a2c6-67e66dc88f77", name: "general" },
];
const feeds = [
  {
    id: 1,
    name: "cointelegraph",
    url: "https://cointelegraph.com/rss",
    feed_type_id: "b871a455-fddb-414c-ac02-2cdee07fa671",
  },
];

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> =>
    queryInterface.sequelize.transaction(async (transaction) => {
      // here go all migration changes
      return Promise.all([
        queryInterface.bulkInsert("feed_types", feedTypes, { transaction }),
        queryInterface.bulkInsert("feeds", feeds, { transaction }),
      ]);
    }),

  down: (queryInterface: QueryInterface): Promise<object | object> =>
    queryInterface.sequelize.transaction(async (transaction) => {
      // here go all migration undo changes
      return Promise.all([
        queryInterface.bulkDelete("feed_types", null as any, { transaction }),
        queryInterface.bulkDelete("feeds", null as any, { transaction }),
      ]);
    }),
};
