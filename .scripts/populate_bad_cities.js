try {
  db.bad_cities.drop();
} catch(err) {
  console.debug(err)
}
db.createCollection('bad_cities');
all_films = db.films.find({});
all_films.forEach(function(film) {
    film.screening && film.screening.forEach(function(screening) {
      city_obj = db.cities.findOne({
        country: screening.s_country,
        state: screening.uf,
        name: screening.city
      })
      if (!city_obj) {
        res = db.bad_cities.findAndModify({query: {
          state: screening.uf,
          name: screening.city,
          country: screening.s_country
        }, update: {
          state: screening.uf,
          name: screening.city,
          country: screening.s_country
        }, new: true, upsert: true, });
        print(JSON.stringify(res));
      }
    })
  })