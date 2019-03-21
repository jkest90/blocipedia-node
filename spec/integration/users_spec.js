const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : users", () => {

   beforeEach((done) => {
      this.user;

      sequelize.sync({force: true}).then((res) => {
         User.create({
            username: "jkest90",
            email: "jkest90@gmail.com",
            password: "1234567890"
         })
         .then((user) => {
            this.user = user;
            done();
         })
         .catch((err) => {
            console.log(err);
            done();
         });
      });
   });

   describe("GET /users/signup", () => {

      it("should render the signup form page", (done) => {
         request.get(`${base}signup`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("Sign Up");
            done();
         });
      });

   });

   describe("POST /users/signup", () => {

      it("should create a new user with a default role of 0 on submit, and redirect", (done) => {
         const options = {
            url: `${base}signup`,
            form: {
               username: "user123",
               email: "user123@gmail.com",
               password: "1234567890"
            }
         };

         request.post(options, (err, res, body) => {
            User.findOne({ where: {username: "user123"}})
            .then((user) => {
               expect(user).not.toBeNull();
               expect(user.username).toBe("user123");
               expect(user.id).toBe(2);
               expect(user.role).toBe(0);
               done();
            })
            .catch((err) => {
               console.log(err);
               done();
            });
         });
      });

      it("should not create a new user with invalid attributes and redirect", (done) => {
         const options = {
            url: `${base}signup`,
            form: {
               username: "jkest90",
               email: "not_a_valid_email",
               password: "1234567890"
            }
         };

         request.post(options, (err, res, body) => {
            User.findOne({where: {email: "not_a_valid_email"}})
            .then((user) => {
               expect(user).toBeNull();
               done();
            })
            .catch((err) =>{
               console.log(err);
               done();
            });
         });

      });

   });

   describe("GET /users/signin", () => {

      it("should render a sign in form", (done) => {
         request.get(`${base}signin`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("Sign In");
            done();
         });
      });

   });

   describe("GET /users/:id/payment", () => {

      it("should render a payment screen", (done) => {
         request.get(`${base}${this.user.id}/payment`, (err, res, body) => {
            expect(body).toContain("Upgrade Account");
            done();
         })
      })

   });

});
