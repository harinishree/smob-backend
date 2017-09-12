//here only routing is done
'use strict';
const newRequest = require('./functions/newRequest');
const updateRequest = require('./functions/updateRequest');
const readRequest = require('./functions/readRequest');
// const updateTransaction = require('./functions/updateTransaction');
// const readTransaction = require('./function/readTransaction');
const cors = require('cors');
const nodemailer = require('nodemailer');
var mongoose = require('mongoose');
var image = require('./models/documents');
var dateTime = require('node-datetime');
var path = require('path');
var cloudinary = require('cloudinary').v2;
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var crypto = require('crypto');


module.exports = router => {

    cloudinary.config({
        cloud_name: 'diyzkcsmp',
        api_key: '188595956976777',
        api_secret: 'F7ajPhx0uHdohqfbjq2ykBZcMiw'

    });



    router.get('/', (req, res) => res.send("Welcome to Supply Chain Management !"));


    router.post('/', (req, res) => {
        console.log(req)
        console.log(req.body)
        res.send("Welcome to Supply Chain Management !")

    });
    router.post("/newRequest", (req, res) => {

        var random_no = "";
        var possible = "0254548745486765468426879hgjguassaiooisjgdiooahvhghudrkhvdgi12041453205253200044525846";
        for (var i = 0; i < 4; i++)
            random_no += possible.charAt(Math.floor(Math.random() * possible.length));

        var requestno = crypto.createHash('sha256').update(random_no).digest('base64');
        var involvedParties = req.body.parties;
        var transactionList = req.body.transactionList;

        if (!transactionList || !transactionList.trim()) {
            res.status(400).json({
                message: 'Invalid Request'
            });
        } else {

            newRequest.newRequest(requestno, involvedParties, transactionList)

            .then(result => {
                res.status(result.status).json({
                    message: result.message,
                    status: true
                })
            })

            .catch(err => res.status(err.status).json({
                message: err.message
            }));
        }
    });

    router.post("/updateRequest", (req, res) => {
        var requestno = crypto.createHash('sha256').update(req.body.requestno).digest('base64');
        var transactionList = req.body.transactionList;

        if (!transactionList || !transactionList.trim()) {
            res.status(400).json({
                message: 'Invalid Request'
            });
        } else {
            updateRequest.updateRequest(requestno, transactionList)

            .then(result => {
                res.status(result.status).json({
                    message: result.message,
                    status: true
                })
            })

            .catch(err => res.status(err.status).json({
                message: err.message
            }));
        }
    });

    router.get("/readRequest", (req, res) => {
        const userid = getUserId(req)
        console.log(userid);
        if (!userid || !userid.trim()) {
            res.status(400).json({
                message: 'Invalid user'
            });
        } else if (1 == 1) {

            updateRequest.updateRequest({
                "user": "dhananjay.p",
                "getRequests": "getRequests"
            });
        }
    });

    router.post("/updateTransaction", (req, res) => {
        var transactionList = req.body.transactionList;

        if (!transactionList || !transactionList.trim()) {
            res.status(400).json({
                message: 'Invalid Request'
            });
        } else {
            updateRequest.updateRequest(transactionList)

            .then(result => {
                res.status(result.status).json({
                    message: result.message,
                    status: true
                })
            })

            .catch(err => res.status(err.status).json({
                message: err.message
            }));
        }
    });


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

    function checkToken(req) {

        const token = req.headers['x-access-token'];

        if (token) {

            try {
                var decoded = jwt.verify(token, config.secret);
                return true
            } catch (err) {
                return false;
            }
        } else {
            return failed;
        }
    }

    function getUserId(req) {
        const token = req.headers['x-access-token'];
        if (token) {
            try {
                var decoded = jwt.verify(token, config.secret);
                return decoded.users._id

            } catch (err) {
                return false;
            }
        } else {
            return failed;
        }
    }
    //Mock Services For UI testing
    //---------------------------------------------------------------------

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


    router.get("/mock/Logout", (req, res) => {


        res.send({
            "message": "Logout succesfully",
            "status": true

        })

    })

    router.post("/mock/Request", (req, res) => {

        console.log(req.body);

        res.send({
            "message": "Request sent Successfully",
            "status": true,
            "details": req.body
        })


    })

    router.post("/mock/Updaterequest", (req, res) => {
        console.log(req.body);
        res.send({
                "message": "updated your request",
                "status": true,
                "details": req.body
            }

        )
    })

    router.post("/mock/UpdateTransaction", (req, res) => {
        console.log(req.body);
        res.send({
                "message": "updated your request",
                "status": true,
                "details": req.body
            }

        )

    })

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
                    "deliverable requied": "dec-2017"

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