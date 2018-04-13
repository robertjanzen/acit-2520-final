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
    })
  } else {
    response.render('index.hbs', {
      render: 'Render',
      name: request.body.name
    })
  }
});

// Handle all other paths and render 404 error page
app.use((request, response) => {
    response.status(404);
    response.render('404.hbs');
});

// Listen on port 80
app.listen(port, () => {
    console.log(`Server is up on the port ${serverPort}`);
});

// ------------------------------ Functions ----------------------------------//
