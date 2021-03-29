'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class text extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  text.init({
    text_content: DataTypes.STRING,
    emotionlist_id: DataTypes.INTEGER,
    date: DataTypes.STRING,
    text_status: DataTypes.STRING,
    user_email:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'text',
  });
  return text;
};