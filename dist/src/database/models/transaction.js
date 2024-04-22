"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Transaction extends sequelize_1.Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Transaction.belongsTo(models.User, {
                as: "users",
                foreignKey: "userId",
                onDelete: "CASCADE",
                hooks: true,
            });
        }
    }
    Transaction.init({
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
    }, {
        sequelize,
        modelName: "Transaction",
        tableName: "transactions",
    });
    return Transaction;
};
