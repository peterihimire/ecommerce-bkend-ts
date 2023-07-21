// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Holiday extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   Holiday.init({
//     holiday_name: DataTypes.STRING,
//     start_date: DataTypes.STRING,
//     acct_id: DataTypes.STRING,
//     end_date: DataTypes.STRING,
//     exempted_personnels: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'Holiday',
//   });
//   return Holiday;
// };