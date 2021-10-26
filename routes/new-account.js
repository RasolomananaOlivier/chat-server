const express = require("express");
const User = require("../models/user-model");

const app = express()


app.post("/new-account", async (req, res) => {
    
    try {
        console.log('> user info ' , req.body);
        const newUser = new User({
            email : req.body.email,
            name : req.body.name,
            password : req.body.password ,
            avatar : "2bd78ede2096ef50c66318d779b60059"
        })
        const saved = await newUser.save()
        res.json(saved)
    } catch (error) {
        console.log('> Error when saving ' , error);
    }
});


module.exports = app ;