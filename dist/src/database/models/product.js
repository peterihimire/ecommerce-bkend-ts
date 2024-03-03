"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Product extends sequelize_1.Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Product.belongsToMany(models.Cart, {
                as: "carts",
                foreignKey: "productId",
                through: "cart_products",
                onDelete: "CASCADE",
                // through: "cart_products",
                // onDelete: "CASCADE",
                // foreignKey: "ProductId",
                // as: "Product",
            });
            Product.belongsToMany(models.Order, {
                through: "order_products",
                onDelete: "CASCADE",
                // foreignKey: "OrderId",
                // as: "Order",
            });
        }
    }
    Product.init({
        title: DataTypes.STRING,
        slug: DataTypes.STRING,
        images: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            allowNull: true,
            defaultValue: [],
        },
        colors: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true,
            defaultValue: [],
        },
        categories: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true,
            defaultValue: [],
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            get() {
                // Workaround until sequelize issue #8019 is fixed
                const value = this.getDataValue("price");
                return value === null ? null : parseFloat(value.toString());
            },
            defaultValue: 0,
            allowNull: false,
        },
        brand: DataTypes.STRING,
        countInStock: DataTypes.INTEGER,
        rating: DataTypes.FLOAT,
        desc: DataTypes.STRING,
        sizes: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true,
            defaultValue: [],
        },
        numReviews: DataTypes.STRING,
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
        },
    }, {
        sequelize,
        modelName: "Product",
        tableName: "products",
    });
    return Product;
};
