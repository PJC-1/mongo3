const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Home Route
app.get('/', function(req, res){
    Article.find({}, function(err, articles){
        if(err){
            console.log(err);
            return;
        } else {
            res.render('index', {
              title : 'Articles',
              articles: articles
            });
        }
    });
});

// Get Single Article
app.get('/article/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
        if(err){
            console.log(err);
            return;
        } else {
            res.render('article', {
              article:article
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
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err){
        if(err){
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    });
});

// Load Edit Form
app.get('/articles/edit/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
        if(err){no
            console.log(err);
            return;
        } else {
            res.render('edit_article', {
                title: 'Edit Article',
                article:article
            });
        }
    });
});


// Update Submit POST Route
app.post('/articles/edit/:id', function(req, res){
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {_id:req.params.id};

    Article.update(query, article, function(err){
        if(err){
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    });
});

// Delete a record
app.delete('/article/:id', function(req, res){
    let query = {_id:req.params.id};

    Article.remove(query, function(err){
        if(err){
            console.log(err);
            return;
        } else {
            res.send('Success');
        }
    });
});


// Start Server
app.listen(process.env.PORT || 3000, function(){
    console.log('Listening to the smooth sounds of port 3000...');
});
