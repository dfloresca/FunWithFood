'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bio extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.bio.belongsTo(models.user);
    }
  }
  bio.init({
    userId: DataTypes.INTEGER,
    state: DataTypes.STRING,
    bio: DataTypes.STRING,
    cuisine: DataTypes.STRING,
    experience: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'bio',
  });
  return bio;
};