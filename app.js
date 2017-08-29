const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/mongo3');
let db = mongoose.connection;

// Check for DB errors
db.on('error', function(err){
    console.log(err);
});

// Check connection
db.once('open', function(){
    console.log('Connected to MongoDB');
});

// Init App
const app = express();

// Bring in Models
let Article = require('./models/article');

// Loud View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Home Route
app.get('/', function(req, res){
    Article.find({}, function(err, articles){
        if(err){
            console.log(err);
        } else {
            res.render('index', {
              title : 'Articles',
              articles: articles
            });
        }
    });
});

// Add Route
app.get('/articles/add', function(req, res){
    res.render('add_article', {
        title : 'Add Article'
    });
});

// Add Submit POST Route
app.post('/articles/add', function(req, res){
    console.log('Submitted');
    return;
});

// Start Server
app.listen(process.env.PORT || 3000, function(){
    console.log('Listening to the smooth sounds of port 3000...');
});
