if (Meteor.isClient) {
    Template.ambassador.rendered = function() {
        console.log("on embassador",Meteor.userId());       
        console.log("on embassador",Meteor.user());       
  }        
}