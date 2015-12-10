if (Meteor.isClient) {

  Template.register.rendered = function() {
    $('.new-ambassador').validator()
  }
  
  Template.register.events({
    "submit .new-ambassador": function (event) {
      
      event.preventDefault();

      var name = event.target.name.value;
      var email = event.target.email.value;
      var password = event.target.password.value;
      var phone = event.target.phone.value;
      var cpf = event.target.cpf.value;
      var institution = event.target.institution.value;
      var category = event.target.category.value;
      var subcategory = event.target.subcategory.value;
      
      Accounts.createUser({
        email: email,
        password: password,
        profile : {
          roles:['ambassador'],
          name: name,
          phone: phone,
          cpf: cpf,
          institution: institution,
          category: category,
          subcategory: subcategory
        }
      },function(){
        Router.go("ambassador");
      });      
    }
  });
}

function messageError(reason) {
  if (reason == 'Email already exists.'){
    message = 'Já existe um cadastro vinculado a este e-mail!'
  }
  else{
    message = 'Ocorreu um erro na criação do seu usuário!'
  }
  $(".form-errors").append(message);
  $('html, body').animate({ scrollTop: 0 }, 'fast');
}
