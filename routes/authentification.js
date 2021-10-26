const express = require("express");
const User = require("../models/user-model");

const app = express();

const verification = async (req, res, next) => {
	try {
        console.log('> Req ' , req.body);
		const result = await User.findOne({
			$and: [{ email: req.body.email }, { password: req.body.password }],
		});
        if (result === null) {
            console.log('> Not found');
            res.json({err : "Not found"})
        } else {
            app.locals.user = result
            next()
        }
	} catch (error) {
        console.log(error);
    }
};

app.post("/login", verification , (req, res) => {
    res.send(req.app.locals.user)
});

module.exports = app;