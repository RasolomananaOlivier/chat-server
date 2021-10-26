const express = require("express");
const User = require("../models/user-model");

const app = express();


app.get("/all-user", async (req, res) => {
    try {
        const result = await User.find({})
        const result_filtered = result.map((item) => {
            const newItem = {
                name : item.name,
                avatar : item.avatar,

            }
            return newItem
        })
        res.json(result_filtered)
    } catch (error) {
        console.log(error);
    }
    
});

module.exports = app;