const User = require("./models").User;
const Wiki = require("./models").Wiki;
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {

   createUser(newUser, callback) {
      const salt = bcrypt.genSaltSync();
      const hashedPassword = bcrypt.hashSync(newUser.password, salt);

      return User.create({
         username: newUser.username,
         email: newUser.email,
         password: hashedPassword
      })
      .then((user) => {
         console.log(user);
         const msg = {
            to: user.email,
            from: 'jkest90@gmail.com',
            subject: 'Welcome to Blocipedia!',
            text: 'You will now gain full access to our Wiki community! Welcome to the club',
            html: '<strong>You will now gain full access to our Wiki community! Welcome to the club</strong>',
         };
         sgMail.send(msg);

         callback(null, user);
      })
      .catch((err) => {
         console.log(err);
         callback(err);
      })
   },

   getUser(id, callback) {
      let result = {};

      User.findById(id)
      .then((user) => {
         if (!user) {
            callback(404);
         } else {
            result["user"] = user;
            Wiki.scope({ method: ["getAllWikis", id] }).all()
            .then((wikis) => {
               result["wikis"] = wikis;
               callback(null, result);
            })
            .catch((err) => {
               callback(err);
            })
         }
      })
   },

   updateUserRole(id, updatedRole, callback) {
      return User.findById(id)
      .then((user) => {
         if (!user) {
            return callback("User not found");
         }
         return user.update({role: updatedRole}, {fields: ["role"] } )
         .then(() => {
            callback(null, user);
         })
         .catch((err) => {
            callback(err);
         })
      })
   }

}
