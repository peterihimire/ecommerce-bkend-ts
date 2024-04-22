"use strict";
import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

interface TransactionAttributes {
  acct_id: string;
  payment_method: string;
  transaction_ref: string;
  amount: number;
  currency: string;
  payment_status: string;
  payment_gateway: string;
  is_successful: boolean;
  is_verified: boolean;
  transaction_id: string;
  refund: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Transaction
    extends Model<TransactionAttributes>
    implements TransactionAttributes
  {
    acct_id!: string;
    payment_method!: string;
    transaction_ref!: string;
    amount!: number;
    currency!: string;
    payment_status!: string;
    payment_gateway!: string;
    is_successful!: boolean;
    is_verified!: boolean;
    transaction_id!: string;
    refund!: number;

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      Transaction.belongsTo(models.User, {
        as: "users",
        foreignKey: "userId",
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  Transaction.init(
    {
      acct_id: DataTypes.STRING,
      payment_method: DataTypes.STRING,
      transaction_ref: DataTypes.STRING,
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        get() {
          // Workaround until sequelize issue #8019 is fixed
          const value = this.getDataValue("amount");
          return value === null ? null : parseFloat(value.toString());
        },
        defaultValue: 0,
        allowNull: false,
      },
      currency: DataTypes.STRING,
      payment_status: DataTypes.STRING,
      payment_gateway: DataTypes.STRING,
      is_successful: DataTypes.BOOLEAN,
      is_verified: DataTypes.BOOLEAN,
      transaction_id: DataTypes.STRING,
      refund: {
        type: DataTypes.DECIMAL(10, 2),
        get() {
          // Workaround until sequelize issue #8019 is fixed
          const value = this.getDataValue("refund");
          return value === null ? null : parseFloat(value.toString());
        },
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Transaction",
      tableName: "transactions",
    }
  );
  return Transaction;
};

// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Transaction extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   Transaction.init({
// acct_id: DataTypes.STRING,
// payment_method: DataTypes.STRING,
// transaction_ref: DataTypes.STRING,
// amount: DataTypes.NUMBER,
// currency: DataTypes.STRING,
// payment_status: DataTypes.STRING,
// payment_gateway: DataTypes.STRING,
// is_successful: DataTypes.BOOLEAN,
// is_verified: DataTypes.BOOLEAN,
// transaction_id: DataTypes.STRING,
// refund: DataTypes.NUMBER
//   }, {
//     sequelize,
//     modelName: 'Transaction',
//   });
//   return Transaction;
// };
