	var express = require('express');

var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});




var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('127.0.0.1', 27017, {auto_reconnect: true});
var db = new Db('winedb', server);
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'winedb' database");
        db.collection('wines', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'wines' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});


app.get('/wines/:id/:pass',  function(req, res) {
    var id = req.params.id;
    var pas = req.params.pass;
    console.log('Retrieving wine: ' + id);
    db.collection('wines', function(err, collection) {
        collection.find({'id':id,'pass':pas}).toArray(function(err, item) {
            if(item.length != 0){
                //res.send("fail");
                res.send("true");
            }
            else{
                res.send("fail");
            }
        });
    });
    });

var populateDB = function() {

    var wines = [
    {
        id: "abc",
        pass:"abc"
    },
    {
        id: "cde",
        pass:"cde"
    }];

    db.collection('wines', function(err, collection) {
        collection.insert(wines, {safe:true}, function(err, result) {});
    });

};  

app.listen(process.env.PORT);
console.log('Listening on port ...'+process.env.PORT);
