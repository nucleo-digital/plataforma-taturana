
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
      console.log(print_links);

      return print_links;
    },
    is_portfolio: function() {
      return (this.status === 'Portfolio');
    },
    inventory: function(){
      return Films.inventory(this);
    }
  });

  Template.showFilm.rendered = function() {
    $('#carousel').slick({
      arrows: true,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 6000,
    });

    if (this.data && this.data.status == 'Portfolio') {
      var inventory = Films.inventory(this.data);

      new Chartist.Pie('#zone-chart', {
        labels: _.keys(inventory.viewers_zones),
        series: _.values(inventory.viewers_zones)
      }, {
        donut: true,
        donutWidth: 46,
        showLabel: false,
        plugins: [
          Chartist.plugins.legend()
        ]
      });

      new Chartist.Line('#viewers-chart', {
        labels: _.keys(inventory.viewers_per_month),
        series: [
          _.values(inventory.viewers_per_month)
        ]
      }, {
        chartPadding: {
          right: 40
        }
      });

      new Chartist.Pie('#institution-type-chart', {
        labels: _.keys(inventory.categories),
        series: _.values(inventory.categories),
      }, {
        donut: true,
        donutWidth: 46,
        showLabel: false,
        plugins: [
          Chartist.plugins.legend()
        ]
      });

      new Chartist.Pie('#institution-area-chart', {
        labels: _.keys(inventory.subcategories),
        series: _.values(inventory.subcategories),
      }, {
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
