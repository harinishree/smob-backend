/**
@author: dhananjay patil
@version: 1.0
@date: 06/05/2017
@Description: Hyperledger Fabric Blockchain sample client
**/
//this is the start of the application 
//from here the blockchain enviornment setup would start and our node js port for webservice would also start running

'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const loggerpac = require('morgan');
const router = express.Router();

var logger;
var Promise = require('bluebird');
var log4js = require('log4js');
// var config = require('config');


module.exports = router;



app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());



const port = process.env.PORT || 3000;



app.use(loggerpac('dev'));

require('./routes')(router);
app.use('/', router);

app.listen(port);
console.log(`App Runs on ${port}`);