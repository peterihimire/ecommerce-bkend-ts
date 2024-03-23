"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const list_data_1 = require("../../utils/list-data");
module.exports = {
    up: (queryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
        // here go all migration changes
        return Promise.all([
            // queryInterface.bulkInsert("feed_types", feedTypes, { transaction }),
            await queryInterface.bulkInsert("roles", list_data_1.ROLES, { transaction }),
        ]);
    }),
    down: (queryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
        // here go all migration undo changes
        return Promise.all([
            // queryInterface.bulkDelete("feed_types", null as any, { transaction }),
            await queryInterface.bulkDelete("roles", null, { transaction }),
        ]);
    }),
};
