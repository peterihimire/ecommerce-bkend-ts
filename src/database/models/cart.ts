"use strict";
import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

interface CartAttributes {
  uuid: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Cart extends Model<CartAttributes> implements CartAttributes {
    uuid!: string;

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      Cart.belongsTo(models.User, {
        as: "user",
        foreignKey: "userId",
        hooks: true,
      });
    }
  }
  Cart.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Cart",
      tableName: "carts",
    }
  );
  return Cart;
};

// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Cart extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   Cart.init({
//     uuid: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'Cart',
//   });
//   return Cart;
// };
