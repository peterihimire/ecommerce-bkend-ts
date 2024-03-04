"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Order extends sequelize_1.Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Order.belongsTo(models.User, {
                as: "user",
                foreignKey: "userId",
                onDelete: "CASCADE",
                hooks: true,
            });
            Order.belongsToMany(models.Product, {
                as: "products",
                foreignKey: "orderId",
                through: "cart_products",
                onDelete: "CASCADE",
            });
        }
    }
    Order.init({
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
        },
    }, {
        sequelize,
        modelName: "Order",
        tableName: "orders",
    });
    return Order;
};
