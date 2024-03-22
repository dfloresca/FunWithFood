'use strict';
const bcrypt = require('bcryptjs');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.recipe);
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 99],
          msg: "Name must be between 1 and 99 characters"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: {
          msg: "Invalid email"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8, 99],
          msg: "Password mus be between 8 and 99 characters"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  // Before a User is created, we are encrypting the passwrod and using hash in its place
  User.addHook('beforeCreate', (pendingUser) => { // pendingUser is user object that gets passed to DB
    //Bcrypt is going to hash the password
    let hash = bcrypt.hashSync(pendingUser.password, 12); //hash 12 times
    pendingUser.password = hash; // this will go to the DB
  });

  // check the password on Sign-in and compare to the hashed password in the DB
  User.prototype.validPassword = function (typedPassword) {
    let isCorrectPassword = bcrypt.compareSync(typedPassword, this.password); // check to see if password is correct.

    return isCorrectPassword;
  }

  //return an object from the database of the User without the encrypted password
  User.prototype.toJSON = function () {
    let userData = this.get();
    delete userData.password; // it doesn't delete password from database only removes it

    return userData
  }

  return User;
};