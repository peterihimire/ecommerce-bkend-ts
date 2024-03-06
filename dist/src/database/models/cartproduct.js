"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class CartProduct extends sequelize_1.Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            CartProduct.belongsTo(models.Cart, {
                foreignKey: "cartId",
                onDelete: "CASCADE",
            });
            CartProduct.belongsTo(models.Product, {
                foreignKey: "productId",
                onDelete: "CASCADE",
            });
        }
    }
    CartProduct.init({
        quantity: DataTypes.INTEGER,
        addedBy: DataTypes.STRING,
        addedAt: {
            allowNull: false,
            defaultValue: new Date(),
            type: DataTypes.DATE,
        },
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
        },
    }, {
        sequelize,
        modelName: "CartProduct",
        tableName: "cart_products",
    });
    return CartProduct;
};
