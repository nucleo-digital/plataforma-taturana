
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
    film_inventory: function(){
      return Films.return_inventory(this);
    }
  });

  Template.showFilm.rendered = function() {
    
    var inventory = this.data.inventory;
    $('#carousel').slick({
      arrows: true,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 6000,
    });
    var zone_chart = new Chartist.Pie('#zone-chart', {
        series: [inventory.sessoes_co, inventory.sessoes_n, inventory.sessoes_ne, inventory.sessoes_s, inventory.sessoes_se ],
        labels: ['CO', 'N', 'NE', 'S', 'SE']
      }, {
        donut: true,
        showLabel: false
      }
      //,
        // plugins: [
        //   Chartist.plugins.legend({
        //     legendNames: ['Blue pill', 'Red pill', 'Purple pill'],
        //   })
        // ]
      
    );
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
  }
}


