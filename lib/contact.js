if (Meteor.isClient) {

  Template.contact.events({
    'submit form#contact-form':function(event){

      event.preventDefault();

      var name = event.target.name.value;
      var email = event.target.email.value;
      var message = event.target.message.value;
      var dataText = "Message from: " + name + "\rEmail: " + email + "\rMessage: " + message;

      pidgeon = {
        to: 'taturanamobi@gmail.com',
        from: '',
        subject: 'Contato Site',
        content: dataText
      };

      Meteor.call('sendEmail', pidgeon, function(err) {
        if (err){
          contactMessageError('Houve algum erro, tente enviar novamente!',err.reason);
        }
        else{
          contactMessageError('Sua mensagem foi enviada com sucesso!');
        }
      });

    }
  });
}

function contactMessageError(message,reason) {
  if (reason){
    alert = message;
  }
  else{
    alert = message;
  }
  $(".form-errors").append(alert);
  $('html, body').animate({ scrollTop: 0 }, 'fast');
}
