if (Meteor.isClient) {

  Template.register.rendered = function() {
    $('.new-ambassador').validator();
  }

  Template.ambassadorFormFields.helpers({
    user_email: function() {
      return (Meteor.user()) ? Meteor.user().emails[0].address : '';
    },
    showPassword: function(){
      return Router.current().route.getName() === 'register'
    },

  });

  Template.register.events({
    "submit .new-ambassador": function (event) {

      event.preventDefault();

      var name = event.target.name.value;
      var email = event.target.email.value;
      var password = event.target.password.value;
      var cell_phone = event.target.cell_phone.value;
      var phone = event.target.phone.value;
      var country = event.target.country.value;
      var city = event.target.city.value;
      var uf = event.target.uf.value;
      var institution = event.target.institution.value;
      var category = event.target.category.value;
      var subcategory = event.target.subcategory.value;

      Accounts.createUser({
        email: email,
        password: password,
        profile : {
          roles:['ambassador'],
          name: name,
          cell_phone: cell_phone,
          phone: phone,
          country: country,
          city: city,
          uf: uf,
          institution: institution,
          category: category,
          subcategory: subcategory
        }
      },function(){
        Router.go("ambassador");

        // Envia email para o ambassador cadastrado
        var ambassadorTemplate = 'new-ambassador.html';

        var ambassador_email = {
          to: email,
          from: 'taturanamobi@gmail.com',
          subject: 'Bem Vind@ à Taturana!',
          absoluteurl: Meteor.absoluteUrl(),
          name: name
        };
        Meteor.call('sendEmail', ambassador_email, ambassadorTemplate);
        // Fim do envio de email

      });
    }
  });

  Template.ambassadorEdit.events({
    "submit .ambassador-edit": function (event) {
      event.preventDefault();

      var avatar_path = (event.target.avatar_path == undefined) ? Session.get('avatar_path') : event.target.avatar_path.value;
      var email = event.target.email.value
      var profile = {
        name: event.target.name.value,
        avatar_path: avatar_path,
        cell_phone: event.target.cell_phone.value,
        phone: event.target.phone.value,
        country: event.target.country.value,
        city: event.target.city.value,
        uf: event.target.uf.value,
        institution: event.target.institution.value,
        category: event.target.category.value,
        subcategory: event.target.subcategory.value
      }

      Meteor.call('updateUser', profile, email);
      FlashMessages.sendSuccess('Atualização efetuada com sucesso!');
      Router.go("ambassador");
    },
    "click .destroy": function () {
      Meteor.call('removeScreening', this._id);
    }
  });
  Template.ambassadorEdit.helpers({
    avatarData: function() {
      return { file_type: 'avatar_path' }
    },
    amount_film_screenings: function(){
      var scrs = Films.screenings_by_user_id(Meteor.userId());
      var today = new Date(),
          past_scr = 0,
          people = 0;

      _.each(scrs, function(scr, i) {
        if (scr.date.getTime() < today.getTime()){
          if (scr.real_quorum) {
            people = scr.real_quorum + people;
          }
          past_scr++;
        }
      });

      return {past_scr, people};
    },
    amount_films: function(){
      return Films.by_user_id(Meteor.userId()).length;
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
