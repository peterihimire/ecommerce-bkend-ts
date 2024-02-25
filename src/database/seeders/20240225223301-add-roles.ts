import { QueryInterface } from "sequelize";
import { ROLES } from "../../utils/list-data";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> =>
    queryInterface.sequelize.transaction(async (transaction) => {
      // here go all migration changes
      return Promise.all([
        // queryInterface.bulkInsert("feed_types", feedTypes, { transaction }),
        await queryInterface.bulkInsert("roles", ROLES, { transaction }),
      ]);
    }),

  down: (queryInterface: QueryInterface): Promise<object | object> =>
    queryInterface.sequelize.transaction(async (transaction) => {
      // here go all migration undo changes
      return Promise.all([
        // queryInterface.bulkDelete("feed_types", null as any, { transaction }),
        await queryInterface.bulkDelete("roles", null as any, { transaction }),
      ]);
    }),
};
