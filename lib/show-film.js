
if (Meteor.isClient) {
  Template.showFilm.helpers({
    linklist: function () {
      var print_links = []
      var links = ["facebook", "twitter", "youtube", "instagram"]
      var film = this

      links.every(function(elem) {
        if (film[elem]) {
          print_links.push({name:elem, link:film[elem]});
        }
      });
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

    /*
       if (inventory) {

       var session_chart = new Chartist.Line('#session-chart', {
labels: ['mês 1', 'mês 2', 'mês 3', 'mês 4'],
series: [
[112, 46, 0, 0]
]
//series: [inventory.mes_1, inventory.mes_2, inventory.mes_3, inventory.mes_4]
}, {
  // Remove this configuration to see that chart rendered with cardinal spline interpolation
  // Sometimes, on large jumps in data values, it's better to use simple smoothing.
lineSmooth: Chartist.Interpolation.simple({
divisor: 2
}),
fullWidth: true,
chartPadding: {
right: 20
},
low: 0
});
}*/
}
}
