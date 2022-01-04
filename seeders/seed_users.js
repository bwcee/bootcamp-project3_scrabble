"use strict";
const bcrypt = require ('bcrypt')

const hash = bcrypt.hashSync("123", 8)

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userList = [
      {
        email: "abc@abc.com",
        user: "abc",
        password: hash,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: "123@123.com",
        user: "123",
        password: hash,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: "steve@steve.com",
        user: "steve",
        password: hash,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: "jerry@jerry.com",
        user: "jerry",
        password: hash,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: "jane@jane.com",
        user: "jane",
        password: hash,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert("users", userList);

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null, {});
  },
};