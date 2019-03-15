const server = require("../../src/server");
const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;

describe("Wikis", () => {

   beforeEach((done) => {

      this.user;
      this.wiki;

      sequelize.sync({force: true}).then((res) => {

         User.create({
            username: "jkest90",
            email: "jkest90@gmail.com",
            password: "1234567890"
         })
         .then((user) => {
            this.user = user;
            Wiki.create({
               title: "Phish NYE",
               body: "Phish better f'in play Miami this year.",
               private: false,
               userId: this.user.id
            })
            .then((wiki) => {
               this.wiki = wiki;
               done();
            });
         });

      });

   });

   describe("#create()", () => {

      it("should create a new Wiki with a title, body, and privacy setting", (done) => {
         Wiki.create({
            title: "Where's the money, Lebowski?",
            body: "The top 1%, genius.",
            private: false,
            userId: this.user.id
         })
         .then((wiki) => {
            expect(wiki).not.toBeNull();
            expect(wiki.title).toBe("Where's the money, Lebowski?");
            expect(wiki.body).toBe("The top 1%, genius.");
            done();
         })
         .catch((err) => {
            console.log(err);
            done();
         });
      });

      it("should not create a new wiki without valid attribute properties", (done) => {
         Wiki.create({
            title: "You Enjoy Myself"
         })
         .then((wiki) => {
            done();
         })
         .catch((err) => {
            expect(err.message).toContain("Wiki.body cannot be null");
            expect(err.message).toContain("Wiki.userId cannot be null");
            done();
         })
      })

   });

   describe("#getUser", () => {

      it("should return the associated User", (done) => {
         this.wiki.getUser()
         .then((associatedUser) => {
            expect(associatedUser.username).toBe("jkest90");
            done();
         })
         .catch((err) => {
            console.log(err);
            done();
         });
      });

   });

   describe("#setUser()", () => {

      it("should associate a Wiki and a User together", (done) => {
         User.create({
            username: "jkest618",
            email: "jkest618@gmail.com",
            password: "12346788"
         })
         .then((newUser) => {
            expect(this.wiki.userId).toBe(this.user.id);
            this.wiki.setUser(newUser)
            .then((wiki) => {
               expect(this.wiki.userId).toBe(newUser.id);
               done();
            })
         })
      })

   })

});
