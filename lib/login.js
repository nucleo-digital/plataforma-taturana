if (Meteor.isClient) {

  Template.login.rendered = function() {
    $('.login-ambassador').validator()
  }

  Template.logout.events({
    "click .logout-ambassador" : function(event){
        debugger;
        event.preventDefault();
        Meteor.logout(function(){
          Router.go("login");
        })
    }
  });

  Template.login.events({
    "submit .login-ambassador": function (event) {
      
      event.preventDefault();

      var email = event.target.email.value;
      var password = event.target.password.value;
        Meteor.loginWithPassword(
            email,
            password
        ,function(err){
            if(err){
                event.target.password.value = "";
                messageError(err);
            }else{
                debugger;
                event.target.reset();
                Router.go("ambassador");
            }
        });
    }
  });
}

function messageError(reason) {
    var message = "Usuário ou senha incorretos"
    $(".form-errors").html(message);
    $('html, body').animate({ scrollTop: 0 }, 'fast');
}