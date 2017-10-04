var express = require('express');
var app = express();
var request = require('request');

app.get('/', function (req, res) {
    res.send('Hello World!');
});

var server = app.listen(3002, function () {
var host = server.address().address;
var port = server.address().port;
    console.log('Your app listening at http://%s:%s', host, port);
});

var requestUrl = 'https://twcservice.au-syd.mybluemix.net/api/weather/v1/alert/2893d192-1ddd-4725-995a-b519702d5d74/details.json?language=en-US';

app.get('/api', function (req, res) {
    request(requestUrl, function (err, response, body) {
        
        if (err) {
        	console.log(err);
            res.send(err).status(400);
        } else {
        	console.log("10 days Forecast");
            res.json(body);
        }
  
});
});