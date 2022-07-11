const express = require("express");
const User = require("../models/user-model");
const app = express()

app.delete('/notification/delete', async (req, res) => {
    try {
        const { userId, notificationId } = req.body;
        const user = await User.findById(userId);

        const notifications = user.notificationsCollections
        const notifUpdated = notifications.filter(notification => `${notification._id}` !== notificationId)

        user.notificationsCollections = notifUpdated
        const update = await user.save()

        res.json({ message: 'deleted' })
    } catch (error) {
        console.log(error);
        res.json({ err: error })
    }
})

module.exports = app;