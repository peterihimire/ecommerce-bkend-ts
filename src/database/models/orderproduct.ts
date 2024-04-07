// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class OrderProduct extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   OrderProduct.init({
//     title: DataTypes.STRING,
//     price: DataTypes.STRING,
//     quantity: DataTypes.NUMBER,
//     uuid: DataTypes.STRING,
//     orderId: DataTypes.NUMBER,
//     productId: DataTypes.NUMBER
//   }, {
//     sequelize,
//     modelName: 'OrderProduct',
//   });
//   return OrderProduct;
// };


"use strict";
import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

interface OrderProductAttributes {
  title: string;
  price: number;
  quantity: number;
  uuid: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class OrderProduct
    extends Model<OrderProductAttributes>
    implements OrderProductAttributes
  {
    title!: string;
    price!: number;
    quantity!: number;
    uuid!: string;

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      OrderProduct.belongsTo(models.Order, {
        foreignKey: "orderId",
        onDelete: "CASCADE",
      });
      OrderProduct.belongsTo(models.Product, {
        foreignKey: "productId",
        onDelete: "CASCADE",
      });
    }
  }
  OrderProduct.init(
    {
      title: DataTypes.STRING,
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
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "OrderProduct",
      tableName: "order_products",
    }
  );
  return OrderProduct;
};
