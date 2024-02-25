"use strict";
import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

interface RoleAttributes {
  name: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Role extends Model<RoleAttributes> implements RoleAttributes {
    name!: string;

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
         Role.belongsToMany(models.Admin, {
           as: "admins",
           foreignKey: "roleId",
           through: "admin_roles",
           onDelete: "CASCADE",
         });
    }
  }
  Role.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Role",
      tableName: "roles",
    }
  );
  return Role;
};

// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Role extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   Role.init({
//     name: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'Role',
//   });
//   return Role;
// };
