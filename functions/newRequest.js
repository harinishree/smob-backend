'use strict';
 var express = require('express');
 var router = express.Router();
 var cors = require('cors');
 var bodyParser = require('body-parser');
 var bcSdk = require('../invoke');
 var user = 'dhananjay.p';
 var affiliation = 'supplychain';

//exports is used here so that newRequest can be exposed for router and blockchainSdk file.
exports.newRequest = (requestno,involvedParties,transactionList) =>
    new Promise((resolve, reject) => {
        const newRequest = ({
            requestno:requestno,
            involvedParties:involvedParties,
            transactionList:transactionList,
        });
        
        bcSdk.materialRequest({ user: user, UserDetails: newRequest })

        .then(() => resolve({ "status": true, "message": "request sent Successfully" }))

        .catch(err => {

            if (err.code == 409) {

                reject({ "status": false, "message": 'Request Already sent!' });

            } else {
                console.log("error occurred" + err);

                reject({ "status": false, "message": 'Internal Server Error !' });
            }
        });
    });