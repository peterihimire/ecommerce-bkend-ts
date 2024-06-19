"use strict";
import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

interface CategoryAttributes {
  fullname: string;
  company: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  uuid: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Category
    extends Model<CategoryAttributes>
    implements CategoryAttributes
  {
    fullname!: string;
    company!: string;
    email!: string;
    phone!: string;
    subject!: string;
    message!: string;
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
      fullname: DataTypes.STRING,
      company: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      subject: DataTypes.STRING,
      message: DataTypes.STRING,
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Contact",
      tableName: "contacts",
    }
  );
  return Category;
};

// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Contact extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   Contact.init({
// fullname: DataTypes.STRING,
// company: DataTypes.STRING,
// email: DataTypes.STRING,
// phone: DataTypes.STRING,
// subject: DataTypes.STRING,
// message: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'Contact',
//   });
//   return Contact;
// };
