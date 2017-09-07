'use strict';

var express = require('express');
var router = express.Router();
var cors = require('cors');
var bodyParser = require('body-parser');
var bcSdk = require('../invoke');
var user = 'dhananjay.p';
var affiliation = 'supplychain';

//exports is used here so that registerUser can be exposed for router and blockchainSdk file as well Mysql.
exports.quotationRequests = (Id, Date, userType, companyName, materialType,quantity,shippingaddress) =>
    new Promise((resolve, reject) => {
        const newRequest = ({
            Id : Id, 
            Date : Date, 
            userType : userType, 
            companyName : companyName, 
            materialType : materialType,
            quantity : quantity,
            shippingaddress : shippingaddress
        });

        bcSdk.materialRequest({ user: user, UserDetails: newRequest })

        .then(() => resolve({ "status": true, "message": "material request sent Successfully" }))

        .catch(err => {

            if (err.code == 409) {

                reject({ "status": false, "message": 'Request Already sent!' });

            } else {
                console.log("error occurred" + err);

                reject({ "status": false, "message": 'Internal Server Error !' });
            }
        });
    });