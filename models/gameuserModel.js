const gameuserModel = (seqInstance, seqObj) => {
  return seqInstance.define(
    "games_user",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: seqObj.INTEGER,
      },
      gameId: {
        allowNull: false,
        type: seqObj.INTEGER,
        references: {
          model: {
            tableName: "games",
          },
          key: "id",
        },
        unique: "compositeIndex",
      },
      userId: {
        allowNull: false,
        type: seqObj.INTEGER,
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        },
        unique: "compositeIndex",
      },
      createdAt: {
        allowNull: false,
        type: seqObj.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: seqObj.DATE,
      },
    },
    {
      // The underscored option makes Sequelize reference snake_case names in the DB.
      // => updatedAt and createdAt will point to created_at and updated_at in the db
      underscored: true,
    }
  );
};

module.exports = gameuserModel;
