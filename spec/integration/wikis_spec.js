const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;

const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;

describe("routes : wikis", () => {

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
               title: "Phish Album Discography",
               body: "The albums of Phish from 1983 - 2019",
               private: false,
               userId: this.user.id
            })
            .then((wiki) => {
               this.wiki = wiki;
               done();
            })
            .catch((err) => {
               console.log(err);
               done();
            });
         });
      });
   });

   describe("User performing CRUD operations on Wiki Resource", () => {

      describe("GET /wikis", () => {

         it("should return all wikis", (done) => {
            request.get(base, (err, res, body) => {
               expect(err).toBeNull();
               expect(body).toContain("Phish Album Discography");
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

      describe("GET /wikis/:id", () => {

         it("should render a view with the selected topic", (done) => {
            request.get(`${base}${this.wiki.id}`, (err, res, body) => {
               expect(err).toBeNull();
               expect(body).toContain("Phish Album Discography");
               expect(body).toContain("The albums of Phish from 1983 - 2019");
               done();
            });
         });

      });

      describe("GET /wikis/:id/edit", () => {

         it("should render an edit wiki form", (done) => {
            request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
               expect(err).toBeNull();
               expect(body).toContain("Edit Wiki");
               done();
            });
         });
      });

   });

   describe("POST /wikis/create", () => {

      it("should create a new wiki in the database", (done) => {
         const options = {
            url: "http://localhost:3000/wikis/create",
            form: {
               title: "Fall Tour Jams of 1997",
               body: "This Wiki is a record of Phish's most noteworthy jams from one of their most infamous tours.",
               privacy: false
            }
         }

         request.post(options, (err, res, body) => {
            Wiki.findOne({ where: { title: "Fall Tour Jams of 1997"} })
            .then((wiki) => {
               console.log(err);
               done();
            })
            .catch((err) => {
               // console.log(err);
               done();
            });
         });
      });

   });

   describe("POST /wikis/:id/destroy", () => {

      it("should delete the wiki with the associated Id", (done) => {
         expect(this.wiki.id).toBe(1);
         request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
            Wiki.findById(1)
            .then((wiki) => {
               expect(err).toBeNull();
               expect(wiki).toBeNull();
               done();
            });
         });
      });

   });

   describe("POST /wikis/:id/update", () => {

      it("should update the wiki with the given value", (done) => {
         const options = {
            url: `${base}${this.wiki.id}/update`,
            form: {
               title: "Keeping it Rollin': The Story of Trey Anastasio",
               body: "An epic tale of tragedy, redemption, and enlightenment."
            }
         };

         request.post(options, (err, res, body) => {
            expect(err).toBeNull();
            Wiki.findOne({ where: { id: this.wiki.id}})
            .then((wiki) => {
               expect(wiki.title).toBe("Keeping it Rollin': The Story of Trey Anastasio");
               done();
            });
         });
      });

   });


});
