const userModel = (seqInstance, seqObj) => {
  return seqInstance.define(
    "user",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: seqObj.INTEGER,
      },
      email: {
        allowNull: false,
        type: seqObj.TEXT,
        unique: true,
      },
      user: {
        allowNull: false,
        type: seqObj.TEXT,
      },
      password: {
        allowNull: false,
        type: seqObj.TEXT,
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

module.exports = userModel;
