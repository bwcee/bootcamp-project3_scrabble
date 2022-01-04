"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        allowNull: false,
        type: Sequelize.TEXT,
        unique: true,
      },
      user: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      password: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.createTable("games", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      turn: {
        allowNull: false,
        type: Sequelize.TEXT,
        defaultValue: "player1",
      },
      game_tiles: {
        type: Sequelize.ARRAY(Sequelize.JSON),
      },
      p1_hand: {
        type: Sequelize.ARRAY(Sequelize.JSON),
      },
      p2_hand: {
        type: Sequelize.ARRAY(Sequelize.JSON),
      },
      board_letters: {
        type: Sequelize.ARRAY(Sequelize.JSON),
      },
      current_word: {
        type: Sequelize.ARRAY(Sequelize.JSON),
      },
      p1_score: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      p2_score: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.createTable("games_users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      game_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "games",
          },
          key: "id",
        },
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        },
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("games_users");
    await queryInterface.dropTable("users");
    await queryInterface.dropTable("games");
  },
};
