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
            User.hasOne(models.Profile, {
                as: "profile",
                foreignKey: "userId",
                onDelete: "CASCADE",
                hooks: true,
            });
            User.hasOne(models.Cart, {
                as: "cart",
                foreignKey: "userId",
                onDelete: "CASCADE",
                hooks: true,
            });
            User.hasMany(models.Order, {
                as: "orders",
                foreignKey: "userId",
                onDelete: "CASCADE",
                hooks: true,
            });
            //  User.hasMany(models.Transaction, {
            //    as: "transactions",
            //    foreignKey: "userId",
            //    onDelete: "CASCADE",
            //    hooks: true,
            //  });
        }
    }
    User.init({
        email: DataTypes.STRING,
        acct_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
        },
        password: DataTypes.STRING,
    }, {
        sequelize,
        modelName: "User",
        tableName: "users",
    });
    return User;
};
