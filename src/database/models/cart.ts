"use strict";
import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

interface CartAttributes {
  uuid: string;
  totalQty: number;
  totalPrice: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Cart extends Model<CartAttributes> implements CartAttributes {
    uuid!: string;
    totalQty!: number;
    totalPrice!: number;

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

      Cart.belongsToMany(models.Product, {
        as: "products",
        foreignKey: "cartId",
        through: "cart_products",
        onDelete: "CASCADE",
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
    },
    {
      sequelize,
      modelName: "Cart",
      tableName: "carts",
    }
  );
  return Cart;
};
