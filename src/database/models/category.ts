"use strict";
import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

interface CategoryAttributes {
  name: string;
  desc: string;
  uuid: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Category
    extends Model<CategoryAttributes>
    implements CategoryAttributes
  {
    name!: string;
    desc!: string;
    uuid!: string;

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
    }
  }
  Category.init(
    {
      name: DataTypes.STRING,
      desc: DataTypes.STRING,
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Category",
      tableName: "categories",
    }
  );
  return Category;
};
