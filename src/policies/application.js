module.exports = class ApplicationPolicy {

   constructor(user, record) {
      this.user = user;
      this.record = record;
   }

   new() {
      return this.user != null;
   }

}
