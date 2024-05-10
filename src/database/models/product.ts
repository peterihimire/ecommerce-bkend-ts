"use strict";
import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

interface ProductAttributes {
  title: string;
  slug: string;
  images: string[];
  color: string;
  categories: string[];
  price: number;
  brand: string;
  countInStock: number;
  rating: number;
  desc: string;
  size: string;
  numReviews: string;
  uuid: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Product extends Model<ProductAttributes> implements ProductAttributes {
    title!: string;
    slug!: string;
    images!: string[];
    color!: string;
    categories!: string[];
    price!: number;
    brand!: string;
    countInStock!: number;
    rating!: number;
    desc!: string;
    size!: string;
    numReviews!: string;
    uuid!: string;

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here

      Product.belongsToMany(models.Cart, {
        as: "carts",
        foreignKey: "productId",
        through: "cart_products",
        onDelete: "CASCADE",
      });

      Product.belongsToMany(models.Order, {
        as: "orders",
        foreignKey: "productId",
        through: "order_products",
        onDelete: "CASCADE",
      });

      Product.hasMany(models.Review, {
        as: "reviews",
        foreignKey: "productId",
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  Product.init(
    {
      title: DataTypes.STRING,
      slug: DataTypes.STRING,
      images: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: true,
        defaultValue: [],
      },
      color: DataTypes.STRING,
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
      size: DataTypes.STRING,
      numReviews: DataTypes.STRING,
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "products",
    }
  );
  return Product;
};
