"use strict";
import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

interface OrderAttributes {
  uuid: string;
  address: string;
  totalQty: number;
  totalPrice: number;
  status: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Order extends Model<OrderAttributes> implements OrderAttributes {
    uuid!: string;
    address!: string;
    totalQty!: number;
    totalPrice!: number;
    status!: string;

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
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
        through: "order_products",
        onDelete: "CASCADE",
      });
    }
  }
  Order.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
      },
      address: {
        type: DataTypes.STRING,
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
      status: {
        type: DataTypes.STRING,
        defaultValue: "pending",// Used for the model
      },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "orders",
    }
  );
  return Order;
};
