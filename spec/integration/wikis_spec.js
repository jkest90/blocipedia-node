const request = require("request");
const base = "http://localhost:3000/wikis/";

const sequelize = require("../../src/db/models/index").sequelize;
const server = require("../../src/server");
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("routes : wikis", () => {
   beforeEach((done) => {
      this.wiki;
      this.user;

      sequelize.sync({ force: true }).then((res) => {
         User.create({
            username: "jkest90",
            email: "jkest90@gmail.com",
            password: "password"
         })
         .then((user) => {
            this.user = user;

            Wiki.create({
               title: "Trey Anastasio",
               body: "Solo Tour Fall Dates!!!",
               private: false,
               userId: this.user.id,
            })
            .then((wiki) => {
               this.wiki = wiki;
               done();
            })
         })
      });

   });

   describe("user performing CRUD actions for Wiki", () => {

      beforeEach((done) => {
         User.create({
            username: "Jonathan",
            email: "jonatahn@gmail.com",
            password: "password123"
         })
         .then((user) => {
            request.get({
               url: "http://localhost:3000/auth/fake",
               form: {
                  username: user.username,
                  userId: user.id,
                  email: user.email
               }
            },
               (err, res, body) => {
                  done();
               }
            );
         })
      });

      describe("GET /wikis", () => {
         it("should respond with all wikis", (done) => {
            request.get(base, (err, res, body) => {
               expect(err).toBeNull();
               expect(body).toContain("Trey Anastasio");
               done();
            });
         });

      });

      describe("GET /wikis/new", () => {
         it("should render a view with a new wiki form", (done) => {
            request.get(`${base}new`, (err, res, body) => {
               expect(err).toBeNull();
               expect(body).toContain("New Wiki");
               done();
            });
         });

      });

      describe("GET /wikis/create", () => {

         it("should create a new wiki and redirect", (done) => {
            const options = {
               url: `${base}create`,
               form: {
                  title: "New Phish Tour",
                  body: "Tour Dates 123",
                  userId: this.user.id,
               }
            };

            request.post(options, (err, res, body) => {
               console.log(res.statusMessage);
               Wiki.findOne({ where: { title: "New Phish Tour" } })
                  .then((wiki) => {
                     expect(wiki.title).toBe("New Phish Tour");
                     expect(wiki.body).toBe("Tour Dates 123");
                     done();
                  })
                  .catch((err) => {
                     console.log(err);
                     done();
                  });
            });

         });

      });

      describe("GET /wikis/:id", () => {

         it("should render a view with the selected wiki", (done) => {
            request.get(`${base}${this.wiki.id}`, (err, res, body) => {
               expect(err).toBeNull();
               expect(body).toContain("Solo Tour Fall Dates!!!");
               done();
            });
         });

      });

      describe("POST /wikis/:id/destroy", () => {

         it("should delete the wiki with the associated ID", (done) => {
            Wiki.all()
            .then((wikis) => {
               const wikiCountBeforeDelete = wikis.length;

               expect(wikiCountBeforeDelete).toBe(1);

               request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
                  Wiki.findById(this.wiki.id)
                  .then((wiki) => {
                     expect(err).toBeNull();
                     // expect(wiki).toBeNull();
                     done();
                  });
               });
            });
         });

      });

      describe("GET /wikis/:id/edit", () => {

         it("should render a view with an edit wiki form", (done) => {
            request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
               expect(err).toBeNull();
               expect(body).toContain("Edit Wiki");
               done();
            })
         });

      });

      describe("POST /wikis/:id/update", () => {

         it("should update the wiki with the given values", (done) => {
            request.post({
               url: `${base}${this.wiki.id}/update`,
               form: {
                  title: "Curveball part 2",
                  body: "One of the best tabletop games!",
                  userId: this.user.id
               }
            }, (err, res, body) => {
               expect(err).toBeNull();
               Wiki.findOne({ where: { id: 1 } })
               .then((wiki) => {
                  expect(wiki.title).toBe("Curveball part 2");
                  done();
               });
            });
         });

         it("should allow other users to update the wiki with the given values", (done) => {
            User.create({
               username: "Alex Summers",
               email: "havok@xavier.edu",
               password: "reekingHavok"
            })
            .then((user) => {
               request.post({
                  url: `${base}${this.wiki.id}/update`,
                  form: {
                     title: "The Mansions of Madness!",
                     body: "The best tabletop games!",
                     userId: user.id
                  }
               }, (err, res, body) => {
                  expect(err).toBeNull();
                  expect(user.id).toBe(3);
                  Wiki.findOne({ where: { id: 1 } })
                  .then((wiki) => {
                     expect(wiki.userId).toBe(3);
                     expect(wiki.title).toBe("The Mansions of Madness!");
                     done();
                  });
               });
            });
         });

      });

   });

});
