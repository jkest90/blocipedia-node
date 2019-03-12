const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;

describe("User", () => {

   beforeEach((done) => {
      sequelize.sync({force: true})
      .then(() => {
         done();
      })
      .catch((err) => {
         console.log(err);
         done();
      });
   });

   describe("#create()", () => {

      it("should create a User object with a valid username, email and password", (done) => {
         User.create({
            username: "user123",
            email: "user123@gmail.com",
            password: "1234567890"
         })
         .then((user) => {
            expect(user.username).toBe("user123");
            expect(user.email).toBe("user123@gmail.com");
            expect(user.password).toBe("1234567890");
            console.log("USER:", user);
            done();
         })
         .catch((err) => {
            console.log(err);
            done();
         });
      });

      it("should not create a User object with invalid username, email, or password", (done) => {
         User.create({
            username: "user123",
            email: "user123, user123!",
            password: "1234567890"
         })
         .then((user) => {
            done();
         })
         .catch((err) =>{
            expect(err.message).toContain("Validation error: must be a valid email");
            done();
         });
      });

      it("should not create a user with an email already taken", (done) => {
         User.create({
            username: "user123",
            email: "user123@gmail.com",
            password: "1234567890"
         })
         .then((user) => {
            User.create({
               username: "user1234",
               email: "username123@gmail.com",
               password: "fakepassword"
            })
            .then((user) => {
               done();
            })
            .catch((err) => {
               expect(err.message).toContain("Validation error");
               done();
            });
         });
      });

   });

});
