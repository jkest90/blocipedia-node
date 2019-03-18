module.exports = class ApplicationPolicy {

   constructor(user, record) {
      this.user = user;
      this.record = record;
   }

   _isOwner() {
      // checks that a record is present and belongs to the user;
      return this.record && (this.record.userId == this.user.id);
   }

   _isAdmin() {
      return this.user && this.user.role == 2;
   }

   _isPremium() {
      return this.user && this.user.role == 1;
   }

   new() {
      return this.user != null;
   }

   show() {
      return true;
   }

   // any user can edit a wiki
   edit() {
      return this.user != null;
   }

   update() {
      return this.edit();
   }

   destroy() {
      return this.update();
   }

}
