'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LoginAuth extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LoginAuth.init({
    user: DataTypes.STRING,
    ip_address: DataTypes.STRING,
    action: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'LoginAuth',
  });
  return LoginAuth;
};