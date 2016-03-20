if (Meteor.isClient) {

  Template.forget.rendered = function() {
    $('.forget-ambassador').validator()
  }

  Template.forget.events({
    "submit .forget-ambassador": function (event) {

      event.preventDefault();

      var email = event.target.email.value;
      Accounts.forgotPassword({email:email},function(err){
        if (err) {
          errorMessage(err);
        } else {
          message("Um e-mail foi enviado");
        }
      })
    }
  });
}
function errorMessage(err){
  if(err.reason==="User not found"){
    message("Usuário inexistente");
  }
}
function message(message) {
    $(".form-errors").html(message);
    $('html, body').animate({ scrollTop: 0 }, 'fast');
}
