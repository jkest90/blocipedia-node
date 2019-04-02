'use strict';
module.exports = (sequelize, DataTypes) => {
   var Wiki = sequelize.define('Wiki', {
      title: {
         type: DataTypes.STRING,
         allowNull: false
      },
      body: {
         type: DataTypes.STRING,
         allowNull: false
      },
      private: {
         type: DataTypes.BOOLEAN,
         allowNull: false,
         defaultValue: false
      },
      userId: {
         type: DataTypes.INTEGER,
         allowNull: false
      }
   }, {});
   Wiki.associate = function(models) {
      // associations can be defined here
      Wiki.belongsTo(models.User, {
         foreignKey: "userId",
         onDelete: "CASCADE"
      });
      Wiki.hasMany(models.Collaborator, {
         foreignKey: "wikiId",
         as: "collaborators"
      });
   };

   Wiki.addScope("getAllWikis", (userId) => {

      return {
         where: { userId: userId },
         limit: 20,
         order: [["createdAt", "DESC"]]
      }

   });

   return Wiki;
};

/* TO DO:

- Premium & Admin users CAN: create new private wikis


1. TEST: Prem. or Admin User creates private wiki
   - AUTHORIZE IF (User.role === '1' OR '2') THEN Wiki.create({'private wiki'})

2. views/wikis/show:



- Premium & Admin users CAN: make public wikis private

1. TEST: Prem. or Admin User updates wiki private attribute to public AND  private to public.

 */
