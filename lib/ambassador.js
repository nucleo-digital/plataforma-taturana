if (Meteor.isClient) {
    Template.ambassador.rendered = function() {
        console.log("on embassador",Meteor.userId());       
  }        
}