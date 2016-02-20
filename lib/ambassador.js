if (Meteor.isClient) {
  Template.ambassador.rendered = function() {
        console.log("on embassador",Meteor.userId());       
  }
  Template.ambassador.helpers({
    disseminate: function() {
      return Films.films_disseminate();
    }
  });    
}