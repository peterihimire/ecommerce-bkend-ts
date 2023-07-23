"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends sequelize_1.Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    User.init({
        id: DataTypes.INTEGER,
        email: DataTypes.STRING,
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        phone: DataTypes.STRING,
        acct_id: DataTypes.STRING,
        password: DataTypes.STRING,
    }, {
        sequelize,
        modelName: "User",
        tableName: "users",
    });
    return User;
};
