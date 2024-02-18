"use strict";
import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

interface ProfileAttributes {
  first_name: string;
  last_name: string;
  title: string;
  acct_id: string;
  phone: string;
  gender: string;
  picture: string;
  is_verified: boolean;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Profile extends Model<ProfileAttributes> implements ProfileAttributes {
    first_name!: string;
    last_name!: string;
    title!: string;
    acct_id!: string;
    phone!: string;
    gender!: string;
    picture!: string;
    is_verified!: boolean;

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
    }
  }
  Profile.init(
    {
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      title: DataTypes.STRING,
      acct_id: DataTypes.STRING,
      phone: DataTypes.STRING,
      gender: DataTypes.STRING,
      picture: DataTypes.STRING,
      is_verified: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Profile",
      tableName: "profiles",
    }
  );
  return Profile;
};
