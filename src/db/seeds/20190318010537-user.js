const faker = require("faker");

//#2
let users = [];

for (let i = 1; i <= 15; i++) {
   users.push({
      username: faker.name.findName(),
      email: faker.internet.email(),
      password: "1234567890",
      createdAt: new Date(),
      updatedAt: new Date()
   });
}

//#3
module.exports = {
   up: (queryInterface, Sequelize) => {
      /*
        Add altering commands here.
        Return a promise to correctly handle asynchronicity.

        Example:
        return queryInterface.bulkInsert("Person", [{
          name: "John Doe",
          isBetaMember: false
        }], {});
      */
      return queryInterface.bulkInsert("Users", users, {});
   },

   down: (queryInterface, Sequelize) => {
      /*
        Add reverting commands here.
        Return a promise to correctly handle asynchronicity.

        Example:
        return queryInterface.bulkDelete("Person", null, {});
      */
      return queryInterface.bulkDelete("Users", null, {});
   }
};
