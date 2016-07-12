if (Meteor.isClient) {
  Template.registerHelper("isEqual", function (arg1, arg2) {
      return arg1 === arg2;
  });

  Template.registerHelper("isAdmin", function () {
    return Meteor.user().profile.roles.indexOf('admin') > -1;
  });

  Template.registerHelper('categories', function() {
    return _.map(CATEGORIES, function(item) { return {name: item}; });
  });

  Template.registerHelper('subcategories', function() {
    return _.map(SUBCATEGORIES, function(item) { return {name: item}; });;
  });

  Template.registerHelper('ufs', function() {
    return ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
             'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
             'RO', 'RS', 'RR', 'SC', 'SE', 'SP', 'TO']
  });

  Template.registerHelper('returnSelectOptions', function(names, film_var ) {
    var ret = _.map(eval(names), function(item) { 
      return {
        name: item,
        status: (item == film_var) ? 'selected' : ''};
      });
    return ret;
  });
  
  Template.registerHelper('categories', function() {
    return ['Cineclube', 'Coletivo', 'Organização Social', 'Universidade', 'Escola Pública', 'Escola Privada', 'Instituição Governamental', 'Espaços e Centros Culturais', 'Equipamento Público', 'Mídia/Blog/Site', 'Formador de Opinião/Especialista', 'Empresa', 'Grupo Religioso', 'Parque', 'Outro']
  });

  Template.registerHelper('subcategories', function() {
    return ['Audiovisual', 'Artes Plásticas', 'Cultura', 'Educação/Ensino/Pedagogia', 'Música', 'Grafite', 'Saúde', 'SESC', 'Meio Ambiente', 'Gênero', 'Ponto de Cultura', 'Comunicação', 'Direito', 'Cidadania', 'Psicologia/Psicanálise', 'Juventude', 'Dança', 'Teatro', 'Infância', 'Política', 'Maternidade', 'Cidade', 'Literatura', 'Outro']
  });
  
  Template.registerHelper('isSelected', function(selectedValue) {
    return (this == selectedValue) ? 'selected' : '';
  });
  

  Template.registerHelper('format_date', function(date) {
    var d = moment(date);

    return d.format('D/M/Y');
  })

  Template.registerHelper('format_time', function(date) {
    var d = moment(date);

    return d.format('hh:mm A');
  })

  Template.registerHelper('shortsynopsis', function(){
    var s_text = this.synopsis;
    var n_text = s_text.substring(0, 430);
    if (n_text.length > 0){
      return n_text + "...";
    }
  })

  Template.registerHelper('avatarPath', function() {
    var avatar = Meteor.user().profile.avatar_path;
    return (avatar) ? '/upload/' + avatar :
      '/images/avatar-default.png'
  })
}

