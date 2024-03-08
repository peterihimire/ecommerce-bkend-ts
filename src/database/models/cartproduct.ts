"use strict";
import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

interface CartProductAttributes {
  title: string;
  price: number;
  quantity: number;
  addedBy: string;
  addedAt: Date;
  uuid: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class CartProduct
    extends Model<CartProductAttributes>
    implements CartProductAttributes
  {
    title!: string;
    price!: number;
    quantity!: number;
    addedBy!: string;
    addedAt!: Date;
    uuid!: string;

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
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
  CartProduct.init(
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
        defaultValue: 1,
        allowNull: false,
      },
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
    },
    {
      sequelize,
      modelName: "CartProduct",
      tableName: "cart_products",
    }
  );
  return CartProduct;
};
