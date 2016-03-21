if (Meteor.isClient) {
  Template.resetPassword.rendered = function() {
    $('.reset-password').validator()
  }

  Template.resetPassword.events({
    "submit .reset-password": function (event) {

      event.preventDefault();

      var resetPasswordForm = $(event.currentTarget),
          error = $('.form-errors'),
          password = resetPasswordForm.find('.password').val(),
          passwordConfirm = resetPasswordForm.find('.password-validation').val();

      if (password !== passwordConfirm) {
        error.html("As senhas não conferem");
        return;
      }

      Accounts.resetPassword(Router.current().params.token, password, function(err) {
        if (err) {
          error.html("Ocorreu um erro. Tente novamente em alguns momentos");
        } else {
          error.html('Sua senha foi alterada.');
        }
      });
    }
  });
}

