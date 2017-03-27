if (Meteor.isClient) {
  Template.showFilm.helpers({
    linklist: function () {
      var print_links = []
      var links = ["facebook", "twitter", "youtube", "instagram"]
      var film = this

      _.each(links, function (elem) {

        if (film[elem]) {
          print_links.push({
            name: elem,
            link: film[elem]
          });
        }
      });

      return print_links;
    },
    is_only_portfolio: function(film) {
      if (!film) {film = this;}
      return (film.status === 'Portfolio')
    },
    is_portfolio: function(film) {
      if (!film) {film = this;}
      return (film.status === 'Portfolio' || film.status === 'Difusão/Portfolio');
    },
    is_difusao: function(film) {
      if (!film) {film = this;}
      return (film.status === 'Difusão' || film.status === 'Difusão/Portfolio');
    },
    is_difusao_portfolio: function(film) {
      if (!film) {film = this;}
      return (film.status === 'Difusão/Portfolio');
    },
    is_oculto: function(film) {
      if (!film) {film = this;}
      return film.status === 'Oculto'
    },
    hideIfNotDifusaoPortfolio: function(film) {
      if (!film) {film = this;}
      if (film.status === 'Difusão/Portfolio') {
        return '';
      }
      return 'hide';
    },
    inventory: function () {
      return Films.inventory(this);
    },
    tibr: function () {
      if (!this.technical_information) return;

      return this.technical_information.replace(/\n/g, "<br />");
    },
    has_categories: function (categories) {
      return !_.isEmpty(categories);
    }
  });

  Template.showFilm.rendered = function () {
    $('#carousel').slick({
      arrows: true,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 6000,
    });
    $("a[rel^='prettyPhoto']").prettyPhoto();

    if (this.data && this.data.status.includes('Portfolio')) {
      var inventory = Films.inventory(this.data);

      if (!inventory) return;
      if (inventory.viewers_zones) {
        labels = []
        _.keys(inventory.viewers_zones).forEach(function(k) {
          labels.push(
            k + " (" + inventory.viewers_zones[k] + ")"
          )
        })
        new Chartist.Pie('#zone-chart', {
          labels: labels, //_.keys(inventory.viewers_zones),
          series: _.values(inventory.viewers_zones)
        }, {
          width: 200,
          donut: true,
          donutWidth: 46,
          showLabel: false,
          plugins: [
            Chartist.plugins.legend()
          ]
        });
      }

      if (inventory.viewers_per_month) {
        series = _.values(inventory.viewers_per_month).slice(0, 4)
        new Chartist.Line('#viewers-chart', {
          labels: [
            '<center>Primeiro Mês<br>(' + series[0] + ')',
            '<center>Segundo Mês<br>(' + series[1] + ')',
            '<center>Terceiro Mês<br>(' + series[2] + ')',
            '<center>Quarto Mês<br>(' + series[3] + ')'
          ],
          series: [series]
        }, {
          height: 200,
          chartPadding: {
            right: 40
          }
        });
      }

      if (inventory.categories) {
        labels = []
        _.keys(inventory.categories).forEach(function(k) {
          labels.push(
            k + " (" + inventory.categories[k] + ")"
          )
        })
        new Chartist.Pie('#institution-type-chart', {
          labels: labels, //_.keys(inventory.categories),
          series: _.values(inventory.categories),
        }, {
          width: 200,
          donut: true,
          donutWidth: 46,
          showLabel: false,
          plugins: [
            Chartist.plugins.legend()
          ]
        });
      }

      if (inventory.subcategories) {
        labels = [];
        _.keys(inventory.subcategories).forEach(function(k) {
          labels.push(
            k + " (" + inventory.subcategories[k] + ")"
          )
        })
        new Chartist.Pie('#institution-area-chart', {
          labels: labels, //_.keys(inventory.subcategories),
          series: _.values(inventory.subcategories),
        }, {
          width: 200,
          donut: true,
          donutWidth: 46,
          showLabel: false,
          plugins: [
            Chartist.plugins.legend()
          ]
        });
      }
    }
  }
}