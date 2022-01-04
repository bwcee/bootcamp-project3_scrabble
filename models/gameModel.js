const gameModel = (seqInstance, seqObj) => {
  return seqInstance.define(
    "game",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: seqObj.INTEGER,
      },
      turn: {
        allowNull: false,
        type: seqObj.TEXT,
        defaultValue: "player1",
      },
      gameTiles: {
        type: seqObj.ARRAY(seqObj.JSON),
      },
      p1Hand: {
        type: seqObj.ARRAY(seqObj.JSON),
      },
      p2Hand: {
        type: seqObj.ARRAY(seqObj.JSON),
      },
      boardLetters: {
        type: seqObj.ARRAY(seqObj.JSON),
      },
      currentWord: {
        type: seqObj.ARRAY(seqObj.JSON),
      },
      p1Id: {
        allowNull: false,
        type: seqObj.INTEGER,
      },
      p2Id: {
        allowNull: false,
        type: seqObj.INTEGER,
      },
      p1Score: {
        type: seqObj.INTEGER,
        defaultValue: 0,
      },
      p2Score: {
        type: seqObj.INTEGER,
        defaultValue: 0,
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

module.exports = gameModel;
