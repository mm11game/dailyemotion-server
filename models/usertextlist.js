'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userTextList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  userTextList.init({
    userInfo_id: DataTypes.INTEGER,
    text_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'userTextList',
  });
  return userTextList;
};