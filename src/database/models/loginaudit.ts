"use strict";
import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

interface LoginAuditAttributes {
  user: string;
  ip_address: string;
  action: string;
  status: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class LoginAudit
    extends Model<LoginAuditAttributes>
    implements LoginAuditAttributes
  {
    user!: string;
    ip_address!: string;
    action!: string;
    status!: string;

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }
  LoginAudit.init(
    {
      user: DataTypes.STRING,
      ip_address: DataTypes.STRING,
      action: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "LoginAudit",
      tableName: "loginaudits",
    }
  );
  return LoginAudit;
};
