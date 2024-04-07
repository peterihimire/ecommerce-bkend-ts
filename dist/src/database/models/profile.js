"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Profile extends sequelize_1.Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Profile.init({
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        title: DataTypes.STRING,
        acct_id: DataTypes.STRING,
        phone: DataTypes.STRING,
        gender: DataTypes.STRING,
        picture: DataTypes.STRING,
        is_verified: DataTypes.BOOLEAN,
    }, {
        sequelize,
        modelName: "Profile",
        tableName: "profiles",
    });
    return Profile;
};
