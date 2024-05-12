"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Role extends sequelize_1.Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Role.belongsToMany(models.Admin, {
                as: "admins",
                foreignKey: "roleId",
                through: "admin_roles",
                onDelete: "CASCADE",
            });
        }
    }
    Role.init({
        name: DataTypes.STRING,
    }, {
        sequelize,
        modelName: "Role",
        tableName: "roles",
    });
    return Role;
};
