"use strict";
import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

interface AdminAttributes {
  name: string;
  email: string;
  user_name: string;
  phone: string;
  last_login: string;
  status: string;
  password: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Admin extends Model<AdminAttributes> implements AdminAttributes {
    name!: string;
    email!: string;
    user_name!: string;
    phone!: string;
    last_login!: string;
    status!: string;
    password!: string;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      Admin.belongsToMany(models.Role, {
        as: "roles",
        foreignKey: "adminId",
        through: "admin_roles",
        onDelete: "CASCADE",
      });
    }
  }
  Admin.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      user_name: DataTypes.STRING,
      phone: DataTypes.STRING,
      last_login: DataTypes.STRING,
      status: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Admin",
      tableName: "admins",
    }
  );
  return Admin;
};
