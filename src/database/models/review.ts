"use strict";
import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

interface ReviewAttributes {
  rating: number;
  review: string;
  name: string;
  email: string;
  uuid: string;
  is_save: boolean;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Review extends Model<ReviewAttributes> implements ReviewAttributes {
    rating!: number;
    review!: string;
    name!: string;
    email!: string;
    uuid!: string;
    is_save!: boolean;

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here

      Review.belongsTo(models.Product, {
        as: "product",
        foreignKey: "productId",
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  Review.init(
    {
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
    },
    {
      sequelize,
      modelName: "Review",
      tableName: "reviews",
    }
  );
  return Review;
};

// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Review extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   Review.init({
// rating: DataTypes.STRING,
// review: DataTypes.STRING,
// name: DataTypes.STRING,
// email: DataTypes.STRING,
// is_confirm: DataTypes.BOOLEAN
//   }, {
//     sequelize,
//     modelName: 'Review',
//   });
//   return Review;
// };
