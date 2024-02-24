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
        }
    }
    Product.init({
        title: DataTypes.STRING,
        slug: DataTypes.STRING,
        images: DataTypes.STRING,
        colors: DataTypes.STRING,
        categories: DataTypes.STRING,
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
        sizes: DataTypes.STRING,
        numReviews: DataTypes.STRING,
        uuid: DataTypes.STRING,
    }, {
        sequelize,
        modelName: "Product",
        tableName: "products",
    });
    return Product;
};
