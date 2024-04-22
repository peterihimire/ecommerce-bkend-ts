"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class LoginAudit extends sequelize_1.Model {
    }
    LoginAudit.init({
        user: DataTypes.STRING,
        ip_address: DataTypes.STRING,
        action: DataTypes.STRING,
        status: DataTypes.STRING,
    }, {
        sequelize,
        modelName: "LoginAudit",
        tableName: "loginaudits",
    });
    return LoginAudit;
};
