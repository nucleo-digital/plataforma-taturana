if (Meteor.isClient) {
  Template.about.helpers({
	  portfolio: function() {
	    return Films.portfolio();
	  }
	});
}

