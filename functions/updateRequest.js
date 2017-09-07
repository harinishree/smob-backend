'use strict';

var express = require('express');
var router = express.Router();
var cors = require('cors');
var bodyParser = require('body-parser');
var bcSdk = require('../invoke');
var user = 'dhananjay.p';
var affiliation = 'supplychain';

//exports is used here so that updateRequest can be exposed for router and blockchainSdk file.
exports.updateRequest = (requestno,involvedParties,transactionList) =>
    new Promise((resolve, reject) => {
        const updateRequest = ({
            requestno:requestno,
            transactionList:transactionList,
        });
        
        bcSdk.updateRequest({ user: user, UserDetails: updateRequest })

        .then(() => resolve({ "status": true, "message": "request updated Successfully" }))

        .catch(err => {

            if (err.code == 409) {

                reject({ "status": false, "message": 'Request Already updated!' });

            } else {
                console.log("error occurred" + err);

                reject({ "status": false, "message": 'Internal Server Error !' });
            }
        });
    });