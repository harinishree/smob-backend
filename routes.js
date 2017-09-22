//here only routing is done
'use strict';
const newRequest = require('./functions/newRequest');
const updateRequest = require('./functions/updateRequest');
const readRequest = require('./functions/readRequest');
const readIndex = require('./functions/readIndex');
const cors = require('cors');
const nodemailer = require('nodemailer');
var request = require('request');
var mongoose = require('mongoose');
var image = require('./models/documents');
var dateTime = require('node-datetime');
var path = require('path');
var cloudinary = require('cloudinary').v2;
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var crypto = require('crypto');

module.exports = router => {
    // file upload API
    cloudinary.config({
        cloud_name: 'rapidqubedigi',
        api_key: '247664843254646',
        api_secret: 'NNP88tw2YEBofSww9bPK7AV9Jc0'

    });

    // weather API key
    var apiKey = '6ebeec1ed5f648e88de55743172109'; 

    // registerUser - routes user input to Regestration API.
    router.post('/registerUser', cors(), (req, res1) => {
        console.log("entering register function ");

        const email_id = req.body.email;

        console.log(email_id);
        const password_id = req.body.password;
        console.log(password_id);
        const userObjects = req.body.userObject;
        console.log(userObjects);
        const usertype_id = req.body.usertype;
        console.log(usertype_id);
        var json = {
            "email": email_id,
            "password": password_id,
            "userObject": userObjects,
            "usertype": usertype_id
        };

        var options = {
            url: 'https://apidigi.herokuapp.com/registerUser',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            json: json
        };


        if (!email_id || !password_id || !usertype_id) {

            res1.status(400).json({
                message: 'Invalid Request !'
            });

        } else {

            request(options, function(err, res, body) {
                if (res && (res.statusCode === 200 || res.statusCode === 201 || res.statusCode === 409)) {

                    res1.status(res.statusCode).json({
                        message: body.message
                    })
                }

            });
        }
    });
    // login -  routes user input to login API.
    router.post('/login', cors(), (req, res1) => {
        console.log("entering login function ");

        const emailid = req.body.email;
        console.log(emailid);
        const passwordid = req.body.password;
        console.log(passwordid);

        var json = {
            "email": emailid,
            "password": passwordid,

        };

        var options = {
            url: 'https://apidigi.herokuapp.com/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            json: json
        };


        if (!emailid || !passwordid) {

            res1.status(400).json({
                message: 'Invalid Request !'
            });

        } else {


            request(options, function(err, res, body) {
                if (res && (res.statusCode === 200 || res.statusCode === 201 || res.statusCode === 401 || res.statusCode === 402 || res.statusCode === 404)) {

                    res1.status(res.statusCode).json({
                        message: body.message,
                        token: body.token,
                        usertype: body.usertype,
                        userdetails: body.userDetails


                    })
                }

            });
        }
    });
    //newRequest -  routes user input to function newRequest. 
    router.post("/newRequest", (req, res) => {
        console.log("Routing User Input to newRequest Function.....!")
        var random_no = "";
        var possible = "0254548745486765468426879hgjguassaiooisjgdiooahvhghudrkhvdgi12041453205253200044525846abcdefghijklmnopqrstuvwxyz";
        for (var i = 0; i < 4; i++)
            random_no += possible.charAt(Math.floor(Math.random() * possible.length));

        var requestid = crypto.createHash('sha256').update(random_no).digest('base64');
        console.log("requestid"+requestid);
        var status = req.body.status;
        console.log("status"+status);
        var InvolvedParties = req.body.InvolvedParties;
        console.log("InvolvedParties"+InvolvedParties);
        var transactionString = JSON.stringify(req.body.transactionString);
        console.log("transactionString"+transactionString);
        if (!transactionString || !transactionString) {
            res.status(400).json({
                message: 'Invalid Request'
            });
        } else {

            newRequest.newRequest(requestid, status, InvolvedParties, transactionString)

                .then(result => {
                    res.status(result.status).json({
                        message: result.message
                        
                    })
                })

                .catch(err => res.status(err.status).json({
                    message: err.message
                }));
        }
    });

    // updateRequest -  routes user input to function updateRequest.
    router.post("/updateRequest", (req, res) => {
        console.log("Routing User Input to updateRequest Function.....!")
        
        var requestid = req.body.requestid;
        var status = req.body.status;
        var transactionString = req.body.transactionString;

        if (!transactionString || !transactionString) {
            res.status(400).json({
                message: 'Invalid Request'
            })
        } else {
            updateRequest.updateRequest(requestid, status, transactionString)

                .then(result => {
                    res.status(result.status).json({
                        message: result.message,
                    })
                })

                .catch(err => res.status(err.status).json({
                    message: err.message
                }));
        }
    });

    // readRequest - query fetches user input given by user for newRequest.
    router.get("/readRequest", (req, res) => {
        var requestList = [];
      
        if (1 == 1) {
            
            const requestid1 = checkToken(req);
            const requestid = requestid1;
            

            readRequest.readRequest(requestid)
                .then(function(result) {
                   
                     return res.json({
                        "status":200,
                        "message": result.query
                    });
                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }));
        } else {
            res.status(401).json({
                "status": false,
                message: 'cant fetch data !'
            });
        }
    });

    // readIndex - query fetches user input given by user for newRequest.
    router.get("/readIndex",cors(), (req, res) => {
        var requestList = [];
        if (1 == 1) {

        readIndex.readIndex({
            "user": "dhananjay.p",
            "getusers": "getusers"
        })
        .then(function(result) {
            
              return res.json({
                 "status": 200,
                 "message":  result.query
             });
         })
         .catch(err => res.status(err.status).json({
             message: err.message
         }));
        }else {
            res.status(401).json({
                "status": false,
                message: 'cant fetch data !'
            });
        }
    });

    // uploadDocs - uploads files to cloudinary server.
    router.post('/UploadDocs', multipartMiddleware, function(req, res, next) {
        var url;
    
        console.log("req.files.image" + JSON.stringify(req.files));
        var imageFile = req.files.fileUpload.path;

        cloudinary.uploader.upload(imageFile, {
                tags: 'express_sample'
            })

            .then(function(image) {
                console.log('** file uploaded to Cloudinary service');
                console.dir(image);
                url = image.url;

                return res.send({
                    url: url,
                    message: "files uploaded succesfully"
                })
            });
        })
       

        // var requestUrl = 'https://api.worldweatheronline.com/free/v2/weather.ashx?q=india&num_of_days=5&apiKey=6ebeec1ed5f648e88de55743172109=24&format=json';
        
        // function dayOfWeekAsString(dayIndex) {
        //     return ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][dayIndex];
        // }
        
        // router.get('/weather', function(req, res) {
        //     request(requestUrl, function(error, response, body) {
        //         if (!error && response.statusCode == 200) {
        //             // parse the json result
        //             var result = JSON.parse(body);
        
        //             // generate a HTML table
        //             var html = '<table style="font-size: 10px; font-family: Arial, Helvetica, sans-serif">';
        
        //             // loop through each row
        //             for (var i = 0; i < 3; i++) {
        //                 html += "<tr>";
        
        //                 result.data.weather.forEach(function(weather) {
        //                     html += "<td>";
        //                     switch (i) {
        //                         case 0:
        //                             html += dayOfWeekAsString(new Date(weather.date).getDay());
        //                             break;
        //                         case 1:
        //                             html += weather.hourly[0].weatherDesc[0].value;
        //                             break;
        //                         case 2:
        //                             var imgSrc = weather.hourly[0].weatherIconUrl[0].value;
        //                             html += '<img src="' + imgSrc + '" alt="" />';
        //                             break;
        //                     }
        //                     html += "</td>";
        //                 });
        //                 html += "</tr>";
        //             }
        
        //             res.send(html);
        //         } else {
        //             console.log(error, response.statusCode, body);
        //         }
        //         res.end("");
        //     });
        // });

    function checkToken(req) {

        const token = req.headers['authorization'];

        if (token) {

            try {
                 (token.length!=0)
                 return token
            } catch (err) {
                return false;
            }
        } else {
            return false;
        }
    }

   //---------------------Mock Services For UI testing--------------------------
    
    // Login service for UI testing with predefined users.
    router.post("/mock/Login", (req, res) => {
        var email = req.body.email;
        var password = req.body.password;
        console.log(JSON.stringify(req.body))
        console.log(email);
        if (email === "man@supply.com") {
            res.send({
                "message": "Login Successful",
                "status": true,
                "userType": "Manufacturer"
            })
        } else if (email == "sup@supply.com") {
            res.send({
                "message": "Login Successful",
                "status": true,
                "userType": "Supplier"
            })
        } else if (email == "dis@supply.com") {
            res.send({
                "message": "Login Successful",
                "status": true,
                "userType": "Distributor"
            })
        } else if (email == "ret@supply.com") {
            res.send({
                "message": "Login Successful",
                "status": true,
                "userType": "retailer"
            })
        } else if (email == "log@supply.com") {
            res.send({
                "message": "Login Successful",
                "status": true,
                "userType": "logistics"
            })
        } else if (email == "bank@supply.com") {
            res.send({
                "message": "Login Successful",
                "status": true,
                "userType": "banker"
            })
        } else if (email == "ins@supply.com") {
            res.send({
                "message": "Login Successful",
                "status": true,
                "userType": "insurance"
            })
        }
    })

    // logout service for UI testing
    router.get("/mock/Logout", (req, res) => {

        res.send({
            "message": "Logout succesfully",
            "status": true

        })

    })
    // request service for NewRequest UI FORM 
    router.post("/mock/Request", (req, res) => {

        console.log(req.body);

        res.send({
            "message": "Request sent Successfully",
            "status": true,
            "details": req.body
        })


    })

    // updateRequest service for Update Request UI FORM
    router.post("/mock/Updaterequest", (req, res) => {
        console.log(req.body);
        res.send({
                "message": "updated your request",
                "status": true,
                "details": req.body
            }

        )
    })

    // update Transaction for transaction Update
    router.post("/mock/UpdateTransaction", (req, res) => {
        console.log(req.body);
        res.send({
                "message": "updated your request",
                "status": true,
                "details": req.body
            }

        )

    })
    // ReadTransaction returns dummy data data for the request.
    router.get("/mock/ReadTransaction", (req, res) => {



        res.send({

            "transactionlist": [{
                    "requesdid": "112",
                    "date": "01-may-2017",
                    "status": "PO raised"
                },
                {
                    "requesdid": "212",
                    "date": "04-may-2017",
                    "status": "Goods shipped"
                },
                {
                    "requesdid": "335",
                    "date": "07-may-2017",
                    "status": "Payment Initiated"
                }


            ]

        })

    })

    // readRequest service gives dummy data for the request
    router.get("/mock/Readrequest", (req, res) => {

        res.send({
            "requestno": "123809",
            "involved parties": ["mrf", "hundei", "fedex"],
            "transactionList": [{
                    "date": "2-may-2017-01:01:0000",
                    "updatedBy": "hundei",
                    "status": "Material request raised",
                    "intended-to": "mrf tyres",
                    "Quantity": "4000",
                    "deliverable required": "dec-2017"

                },
                {
                    "date": "3-may-2017-01:01:0000",
                    "updatedBy": "mrf",
                    "status": "Quotation raised",
                    "intended-to": "Hyundei",
                    "Quantity": "4000",
                    "cost": "500 per lot",
                    "last delivery": "dec-2017",
                    "delivery mode": "monthly",
                    "Attachment": "https://fileserver.org/?filename=xyz.pdf&fileid=3456"
                },
                {
                    "date": "4-may-2017-01:01:0000",
                    "updatedBy": "hyundei",
                    "status": "Purchase order raised",
                    "intended-to": "mrf tyres",
                    "Quantity": "4000",
                    "cost": "500 per lot",
                    "last delivery": "dec-2017",
                    "delivery mode": "monthly",
                    "Attachment": "https://fileserver.org/?filename=xyz.pdf&fileid=3456"
                }

            ]

        })


    })
}