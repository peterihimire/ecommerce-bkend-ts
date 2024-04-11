require("ts-node/register");
// const config = require("./config/database.ts"); // Change the path to your config file
const config = require("./src/database/config/config.ts"); // Change the path to your config file

// for debug purposes
console.log({ config });

module.exports = config;
