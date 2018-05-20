// Defines dependencies
var express = require("express");
var exphbs  = require('express-handlebars');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require("request");


// Sets up the Express App
var app = express();
var port = process.env.PORT || 3000


// Require all models
var db = require("./models");


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
//app.use(logger("dev"));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


// Database configuration with mongoose
mongoose.connect("mongodb://localhost/mongoHeadlines");
//mongoose.connect("mongodb://heroku_0qqw53mz:bjd50o97uugrj47t58g3f1ro4e@ds229690.mlab.com:29690/heroku_0qqw53mz");
var db = mongoose.connection;

app.get('/', function (req, res) {
    res.render('home');
});


// // Make a request call to grab the HTML body
// request("https://www.nytimes.com/", function(error, response, html) {

//   // Load the HTML into cheerio and save it to a variable
//   // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
//   var $ = cheerio.load(html);

//   // An empty array to save the data that we'll scrape
//   var results = [];

//   // Select each element in the HTML body from which you want information.
//   // NOTE: Cheerio selectors function similarly to jQuery's selectors,
//   // but be sure to visit the package's npm page to see how it works
//   $("li.leaf").each(function(i, element) {

//     var link = $(element).children().attr("href");
//     var link = $(element).children().attr("href");
//     var title = $(element).children().text();

//     // Save these results in an object that we'll push into the results array we defined earlier
//     results.push({
//       title: title,
//       link: link
//     });
//   });

//   // Log the results once you've looped through each of the elements found with cheerio
//   console.log(results);
// });



//Listen to port
app.listen(port, function() {
  console.log("App running on port " + port);
});


//demo app http://nyt-mongo-scraper.herokuapp.com/
