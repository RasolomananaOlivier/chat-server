const express = require("express");
const User = require("../models/user-model");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config()
const app = express()


app.post("/new-account", async (req, res) => {

    try {
        console.log('> user info ', req.body);
        const newUser = new User({
            email: req.body.email,
            name: req.body.name,
            password: req.body.password,
            avatar: "default"
        })
        const saved = await newUser.save()
        const token = jwt.sign(JSON.stringify(saved), process.env.TOKEN_SECRET)
        result = {
            user: saved,
            token: `bearer ${token}`
        }
        res.json(result)
    } catch (error) {
        res.json({ err: "Error while trying to save data" })
    }
});


module.exports = app;