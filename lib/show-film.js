
if (Meteor.isClient) {
  Template.showFilm.helpers({
    linklist: function () {
      var print_links = []
      var links = ["facebook", "twitter", "youtube", "instagram"]
      var film = this

      _.each(links, function(elem) {

        if (film[elem]) {
          print_links.push({name:elem, link:film[elem]});
        }
      });

      return print_links;
    },
    is_portfolio: function() {
      return (this.status === 'Portfolio' || this.status === 'Difusão/Portfolio');
    },
    is_difusao: function() {
      return (this.status === 'Difusão' || this.status === 'Difusão/Portfolio');
    },
    inventory: function(){
      return Films.inventory(this);
    },
    tibr: function() {
      if (!this.technical_information) return;

      return this.technical_information.replace(/\n/g, "<br />");
    },
    has_categories: function(categories) {
      return !_.isEmpty(categories);
    }
  });

  Template.showFilm.rendered = function() {
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
        new Chartist.Pie('#zone-chart', {
          labels: _.keys(inventory.viewers_zones),
          series: _.values(inventory.viewers_zones)
        }, {
          width:200,
          donut: true,
          donutWidth: 46,
          showLabel: false,
          plugins: [
            Chartist.plugins.legend()
          ]
        });
      }

      if (inventory.viewers_per_month) {
        new Chartist.Line('#viewers-chart', {
          labels: _.keys(inventory.viewers_per_month),
          series: [
            _.values(inventory.viewers_per_month)
          ]
        }, {
          height:200,
          chartPadding: {
            right: 40
          }
        });
      }

      if (inventory.categories) {
        new Chartist.Pie('#institution-type-chart', {
          labels: _.keys(inventory.categories),
          series: _.values(inventory.categories),
        }, {
          width:200,
          donut: true,
          donutWidth: 46,
          showLabel: false,
          plugins: [
            Chartist.plugins.legend()
          ]
        });
      }

      if (inventory.subcategories) {
        new Chartist.Pie('#institution-area-chart', {
          labels: _.keys(inventory.subcategories),
          series: _.values(inventory.subcategories),
        }, {
          width:200,
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
