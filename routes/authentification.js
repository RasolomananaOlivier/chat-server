const express = require("express");
const User = require("../models/user-model");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const app = express();

//get config variables
dotenv.config()

const verification = async (req, res, next) => {
    try {
        console.log('> Req ', req.body);
        const result = await User.findOne({
            $and: [{ email: req.body.email }, { password: req.body.password }],
        });
        if (result === null) {
            console.log('> Not found');
            res.json({ err: "Not found" })
        } else {
            console.log(process.env.TOKEN_SECRET);
            // Sign for jwt
            const token = jwt.sign(JSON.stringify(result), process.env.TOKEN_SECRET)
            app.locals.user = {
                user: result,
                token: `bearer ${token}`
            }
            next()
        }
    } catch (error) {
        console.log(error);
    }
};

app.post("/login", verification, (req, res) => {
    res.send(req.app.locals.user)
});


app.get("/verifyToken", (req, res) => {
    console.log(req.headers);
    const token = req.headers['x-access-token'].split(' ')[1]
    jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {

        if (err) {
            return res.json({ isLoggedIn: false })
        }

        res.json({
            isLoggedIn: true,
            user: payload
        })
    })
});


module.exports = app;