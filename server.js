// Include npm pac
const express = require('express');
const request = require('request');
const hbs = require('hbs');
const fs = require('fs');
const _ = require('lodash');
const bodyParser = require('body-parser');
var port = process.env.PORT || 8080;

// Setup express
var app = express();
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

// ------------------------------- Helpers -----------------------------------//
// hbs.registerHelper('searchResults', (list) => {
// return `<a href="/fetchDetails?n=${list.srchList[index]}">Descriptive Text</a>`;
// })

// -------------------------------- Paths ------------------------------------//
// Main page
app.get('/', (request, response) => {
  response.render('index.hbs', {
    render: 'Render'
  })
});

// Post to form on main page
app.post('/', (request, response) => {

  if (request.body.name == '') {
    response.render('index.hbs', {
      render: 'Render'
    });
  } else {
    gmaps(request.body.loc).then((coordinates) => {
      weather(coordinates).then((summary) => {
        response.render('index.hbs', {
          render: 'Location Found',
          loc: summary
        });
      });
    });
  }
});

// .catch(error) => {
//   serverError(response, error);
// }

// weather(coordinates).then((summary) => {
//   response.render('index.hbs', {
//     render: 'Location Found',
//     loc: summary

// Handle all other paths and render 404 error page
app.use((request, response) => {
    response.status(404);
    response.render('404.hbs');
});

// Listen on port 80
app.listen(port, () => {
    console.log(`Server is up on the port ${port}`);
});

// ------------------------------ Functions ----------------------------------//
var gmaps = (location) => {
  return new Promise(async(resolve, reject) => {
    request({
      url: `http://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}`,
      json: true
    }, (error, response, body) => {
      if (error) {
        reject(error);
      } else if (body.status === 'ZERO_RESULTS') {
        reject(error);
      } else if (body.status === 'OK') {
        var result = {
          "lat": body.results[0].geometry.location.lat,
          "lng": body.results[0].geometry.location.lng
        }
        resolve(result);
      }
    });
  });
}

var weather = (cords) => {
  return new Promise(async(resolve, reject) => {
    request({
      url: `https://api.darksky.net/forecast/a05801ddfd47bee6dbc2b05a8877b901/${cords['lat']},${cords['lng']}`,
      json: true
    }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(body.currently.summary);
      } else {
        reject(error);
      }
    });
  });
}
