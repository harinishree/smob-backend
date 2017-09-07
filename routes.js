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

    router.post("/newRequest", (req,res)=>{
        
        var requestno =  crypto.createHash('sha256').update(requestno).digest('base64');
        var involvedParties = req.body.parties;
        var transactionList = req.body.transactionList;
     
        if(!transactionList|| !transactionList.trim()){
        res.status(400).json({
            message: 'Invalid Request'
        });
        } else {
            
            newRequest.newRequest(requestno,involvedParties,transactionList)
          
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
 
        router.post("/updateRequest",(req,res)=>{
            var requestno =  crypto.createHash('sha256').update(req.body.requestno).digest('base64');
            var transactionList = req.body.transactionList;
         
            if(!transactionList|| !transactionList.trim()){
            res.status(400).json({
                message: 'Invalid Request'
            });
            } else {
            updateRequest.updateRequest(requestno,transactionList)
              
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
        
        router.get("/readRequest",(req,res)=>{
            const userid = getUserId(req)
            console.log(userid);  
            if(!userid|| !userid.trim()){
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

        router.post("/updateTransaction",(req,res)=>{
            var transactionList = req.body.transactionList;
         
            if(!transactionList|| !transactionList.trim()){
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
                           url :url,
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

                     
            }