// Defines dependencies
var express = require("express");
var exphbs  = require('express-handlebars');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require("request");
var logger = require("morgan");
var axios = require("axios");


// Sets up the Express App
var app = express();
var port = process.env.PORT || 3000


// Require all models
var db = require("./models");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(logger("dev"));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


// Database configuration with mongoose
mongoose.connect("mongodb://localhost/mongoHeadlines");
//mongoose.connect("mongodb://heroku_0qqw53mz:bjd50o97uugrj47t58g3f1ro4e@ds229690.mlab.com:29690/heroku_0qqw53mz");
//var db = mongoose.connection;


//GET requests to render Handlebars pages
app.get('/', function (req, res) {
    res.render('home');
});


// Scrapes data from Nytimes into database
app.get("/scrape", function(req, res) {
  // Make a request for the news section of `ycombinator`
  request("https://www.nytimes.com/", function(error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("h2.headline").each(function(i, element) {
       // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });


    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});



// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


//Listen to port
app.listen(port, function() {
  console.log("App running on port " + port);
});


//demo app http://nyt-mongo-scraper.herokuapp.com/
