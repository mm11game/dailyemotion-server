'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class date extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  date.init({
    year: DataTypes.STRING,
    month: DataTypes.STRING,
    day: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'date',
  });
  return date;
};