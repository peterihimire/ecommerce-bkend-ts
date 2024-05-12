"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Admin extends sequelize_1.Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Admin.belongsToMany(models.Role, {
                as: "roles",
                foreignKey: "adminId",
                through: "admin_roles",
                onDelete: "CASCADE",
            });
        }
    }
    Admin.init({
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        user_name: DataTypes.STRING,
        phone: DataTypes.STRING,
        last_login: DataTypes.STRING,
        status: DataTypes.STRING,
        password: DataTypes.STRING,
    }, {
        sequelize,
        modelName: "Admin",
        tableName: "admins",
    });
    return Admin;
};
