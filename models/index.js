"use strict";

// imports w CJS format
const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const userModel = require("./userModel.js");
const gameModel = require("./gameModel.js");
const gameuserModel = require("./gameuserModel.js");

const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.User = userModel(sequelize, Sequelize.DataTypes);
db.Game = gameModel(sequelize, Sequelize.DataTypes);
db.GameUser = gameuserModel(sequelize, Sequelize.DataTypes);

// https://sequelize.org/master/manual/assocs.html
// These three calls will cause Sequelize to automatically add foreign keys to the appropriate models (unless they are already present)
// https://sequelize.org/master/manual/advanced-many-to-many.html
// The best of both worlds: the Super Many-to-Many relationship
// defining relationships this way  allows all kinds of eager loading options according to docs above
// just being super kiasu here and defining the foreginKey altho not strictly needed
db.User.belongsToMany(db.Game, { through: db.GameUser });
db.Game.belongsToMany(db.User, { through: db.GameUser });
db.User.hasMany(db.GameUser, { foreignKey: "user_id" });
db.GameUser.belongsTo(db.User);
db.Game.hasMany(db.GameUser, { foreignKey: "game_id" });
db.GameUser.belongsTo(db.Game);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
