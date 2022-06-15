const express = require("express");
const User = require("../models/user-model");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config()
const app = express()


app.post("/signup", async (req, res) => {

  try {

    const { firstName, lastName, email, birthday, bio, passwd, avatarFileName } = req.body

    // Find if the user email already exist 
    const emailTaken = await User.findOne({ email: email })


    bcrypt.hash(passwd, 10, async function (err, hashedPassword) {
      err && res.json({ err: "Error while hashing password" })


      const newUser = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        birthday: birthday,
        bio: bio,
        avatarFileName: avatarFileName,
        passwd: hashedPassword,
        requests: [],
        friendsCollections: [],
        notificationsCollections: []
      })
      const saved = await newUser.save()
      const token = jwt.sign(JSON.stringify(saved), process.env.TOKEN_SECRET);
      result = {
        user: saved,

        token: `bearer ${token}`,
        isRegistered: true,
      }

      res.json(result)
    })
  } catch (error) {
    res.json({ err: "Error while trying to save data" + error, isRegistered: false })
  }
});



module.exports = app;