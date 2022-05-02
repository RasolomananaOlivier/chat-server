const express = require("express");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const User = require("../models/user-model");
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');



dotenv.config()

const router = express.Router();
// For streaming
const mongoose = require("mongoose");
const mongodb = require('mongodb');
const { database } = require("../database/config");

const environment = process.env.NODE_ENV || 'development';
console.log(environment);
let DATABASE;
if (environment === 'development') {
    DATABASE = database.local;
} else {
    DATABASE = database.deploy;
}


const storage = new GridFsStorage({
    url: DATABASE,
    file: (req, file) => {
        return {
            bucketName: "profil",
            filename: `avatar-${Date.now()}-firechat-${Math.round(Math.random() * 1000)}`
        }
    }
});


const upload = multer({ storage });



router.post("/upload", upload.single("avatar"), async (req, res) => {

    try {
        console.log('>uploading', req.file);
        res.json({
            isUpload: true,
            avatarId: req.file.id,
            avatarFileName: req.file.filename,
        })

    } catch (error) {
        console.log(error)
        res.json({
            isUpload: false,
            err: error,
            avatarId: req.file.id,
        })

    }
});




router.get("/avatar/:fileName", async (req, res) => {

    try {
        console.log(req.params)
        /*--- snippet ---*/
        const fileName = req.params.fileName;

        if (req.params.fileName !== 'undefined') {
            mongodb.MongoClient.connect(process.env.DATABASE_URI, (err, client) => {
                const db = client.db('chatapp')
                var bucket = new mongodb.GridFSBucket(db, { bucketName: 'profil' })
                // console.log(bucket);

                let read = bucket.openDownloadStreamByName(fileName);
                read.pipe(res);

            })
        }

    } catch (error) {
        console.log('Error downloading', error);
    }
});

module.exports = router;
