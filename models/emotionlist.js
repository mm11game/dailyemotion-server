'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class emotionlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  emotionlist.init({
    emotion_id: DataTypes.INTEGER,
    text_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'emotionlist',
  });
  return emotionlist;
};