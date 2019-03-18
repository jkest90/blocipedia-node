const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {

   create() {
      return this.new();
   }

   modify() {
      return this.edit();
   }

   destroy() {
      return this._isOwner() || this._isAdmin();
   }

}
