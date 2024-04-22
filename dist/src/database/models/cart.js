"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Cart extends sequelize_1.Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Cart.belongsTo(models.User, {
                as: "user",
                foreignKey: "userId",
                onDelete: "CASCADE",
                hooks: true,
            });
            Cart.belongsToMany(models.Product, {
                as: "products",
                foreignKey: "cartId",
                through: "cart_products",
                onDelete: "CASCADE",
            });
        }
    }
    Cart.init({
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
        },
        totalQty: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        totalPrice: {
            type: DataTypes.DECIMAL(10, 2),
            get() {
                // Workaround until sequelize issue #8019 is fixed
                const value = this.getDataValue("totalPrice");
                return value === null ? null : parseFloat(value.toString());
            },
            defaultValue: 0,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: "Cart",
        tableName: "carts",
    });
    return Cart;
};
