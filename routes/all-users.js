const express = require("express");
const User = require("../models/user-model");
const Message = require('../models/message-model')
const mongodb = require('mongodb');
const dotenv = require('dotenv');
const readstream = require("gridfs-stream/lib/readstream");

const app = express();

dotenv.config();

app.get("/all-user/:userId", async (req, res) => {
  try {
    const result = await User.find({});
    const userInfo = await User.findById(req.params.userId);
    const result_filtered = [];
    result.map((item) => {
      if (
        `${item._id}` !== `${userInfo._id}` &&
        !userInfo.friendsCollections.some(friend => `${friend._id}` === `${item._id}`)
      ) {
        const newItem = {
          _id: item._id,
          lastName: item.lastName,
          firstName: item.firstName,
          avatarFileName: item.avatarFileName,
          email: item.email,
          bio: item.bio,


        }
        result_filtered.push(newItem);
      }
    })
    res.status(200).json(result_filtered);
  } catch (error) {
    console.log(error);
  }

});

app.post('/update-account', async (req, res) => {
  try {
    const { _id, firstName, lastName, bio, email } = req.body;
    const userAccount = await User.findById(_id);
    userAccount.firstName = firstName;
    userAccount.lastName = lastName;
    userAccount.bio = bio;
    userAccount.email = email;

    userAccount.friendsCollections.forEach(async (friendAccount) => {
      const friendAccountDoc = await User.findById(friendAccount._id);

      let newFriendsCollections = [];
      friendAccountDoc.friendsCollections.forEach(account => {
        if (account._id === _id) {
          newFriendsCollections.push({
            _id: account._id,
            firstName: firstName,
            lastName: lastName,
            avatarFileName: account.avatarFileName,
            email: email,
            bio: bio
          })
        } else {
          newFriendsCollections.push({
            _id: account._id,
            firstName: account.firstName,
            lastName: account.lastName,
            avatarFileName: account.avatarFileName,
            email: account.email,
            bio: account.bio
          });
        }
      })
      // console.log('new friend collection', newFriendsCollections);
      friendAccountDoc.friendsCollections = newFriendsCollections;
      await friendAccountDoc.save();
    });

    const userAccountUpdated = await userAccount.save();
    res.json(userAccountUpdated);
  } catch {

  }
})

app.get("/search", (req, res) => {
  const regex = new RegExp(`^${req.body.query}`)
  User.find({ name: { $regex: regex } })
    .then((result) => {
      res.json({ query: result })
    }).catch((err) => {
      res.json({ err: err })
    });
});



module.exports = app;