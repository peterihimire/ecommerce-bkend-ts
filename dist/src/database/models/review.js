"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Review extends sequelize_1.Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // Review.belongsTo(models.Product, {
            //   as: "product",
            //   foreignKey: "productId",
            //   onDelete: "CASCADE",
            //   hooks: true,
            // });
        }
    }
    Review.init({
        rating: DataTypes.FLOAT,
        review: DataTypes.STRING,
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
        },
        is_save: DataTypes.BOOLEAN,
    }, {
        sequelize,
        modelName: "Review",
        tableName: "reviews",
    });
    return Review;
};
