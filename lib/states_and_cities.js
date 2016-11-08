States = new Mongo.Collection("states");
Cities = new Mongo.Collection("cities");

States.with_screenings = function() {
    return States.find({has_screenings:true});
}

Cities.with_screenings = function() {
    return Cities.find({has_screenings:true});
}

if (Meteor.isClient) {
    Meteor.subscribe("cities", function(){ console.debug("Cities: " + Cities.find().count());});
    Meteor.subscribe("states", function(){ console.debug("States: " + States.find().count());});
}