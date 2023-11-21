'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class recipe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.recipe.belongsTo(models.user);
    }
  }
  recipe.init({
    userId: DataTypes.INTEGER,
    recipeName: DataTypes.STRING,
    description: DataTypes.STRING,
    url: DataTypes.STRING,
    signatureDish: DataTypes.BOOLEAN,
    cooked: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'recipe',
  });
  return recipe;
};