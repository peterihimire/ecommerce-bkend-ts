"use strict";

import * as fs from "fs";
import * as path from "path";
import { Sequelize, DataTypes, Model } from "sequelize";
import dotenv from "dotenv";

dotenv.config();
// import { ProcessEnv } from "process";

const basename: string = path.basename(__filename);
const env: string = (process.env.NODE_ENV as string) || "development";
const config: any = require(__dirname + "/../config/config.ts")[env];
const db: any = {};

let sequelize: Sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(
    process.env[config.use_env_variable] as string,
    config
  );
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file: string) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".ts" &&
      file.indexOf(".test.ts") === -1
    );
  })
  .forEach((file: string) => {
    const model: typeof Model = require(path.join(__dirname, file))(
      sequelize,
      DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName: string) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
