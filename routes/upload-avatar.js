const express = require("express");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const { database } = require("../database/config");
const User = require("../models/user-model");
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");

const storage = new GridFsStorage({ url: database });

const upload = multer({ storage });

const app = express();

app.post("/upload", upload.single("avatar"), async (req, res) => {
	try {
		const result = await User.findOne({ name: req.body.name });

		result.avatar = req.file.filename;
		result
			.save()
			.then((result) => {
				console.log('> Pdp updated : ok');
			})
			.catch((err) => {
				console.log(error);
			});
	} catch (error) {
		console.log(error);
	}
});

const conn = mongoose.createConnection(database);
let gfs;
conn.once("open", () => {
    console.log('>connection to db ok');
	gfs = Grid(conn.db, mongoose.mongo);
});



app.get("/profil/:user", async (req, res) => {
	try {
		const file = await gfs.files.findOne({
			filename : req.params.user
		});
		const readStream = gfs.createReadStream(file.filename);
		readStream.pipe(res);
       
	} catch (error) {
        console.log(error);
    }
});

module.exports = app;
