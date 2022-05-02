const User = require("../models/user-model");

async function addNotificationToFriend(id, details) {
    try {
        const result = await User.findById(id);
        const result2 = await User.findById(details._id);


        // Update the notification 
        const date = new Date();
        const newNotification = {

            content: `${result.firstName} ${result.lastName} has accepted your invitation`,
            timeStamp: `${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`
        }
        result2.notificationsCollections.push(newNotification);


        const saved = await result2.save();

        return saved;
    }
    catch (error) {
        console.log(error);
    }
}



module.exports = addNotificationToFriend;