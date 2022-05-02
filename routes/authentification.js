const express = require("express");
const User = require("../models/user-model");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

const app = express();

//get config variables
dotenv.config()

const verification = async (req, res, next) => {
    try {
        console.log('> Req ', req.body);
        const result = await User.findOne({
            email: req.body.email
        });


        if (result === null) {
            // console.log('> Not found');
            res.json({ err: "Not found" })
        } else {
            // console.log(process.env.TOKEN_SECRET);
            bcrypt.compare(req.body.password, result.passwd, function (err, isCorrect) {
                if (!isCorrect) res.json({ err: 'Wrong password' })

                const noCryptedData = {
                    ...result,
                    password: req.body.password
                }

                // Sign for jwt
                const token = jwt.sign(JSON.stringify(noCryptedData), process.env.TOKEN_SECRET)
                app.locals.user = {
                    user: result,
                    token: `bearer ${token}`,
                    isRegistered: true,
                }
                next()
            })


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
    jwt.verify(token, '41388e22b729f9c0a797137d5802036b61dddb5f055a40d9a16a7cb9a5c5793e7e8aea425762ca45852aad5a49ae2dffe29fd14228387ab5b66fb6f779ef23f5', (err, payload) => {

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