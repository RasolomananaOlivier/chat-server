const Media = require("../models/media-model");


const createNewMedia = async (userId, friendId) => {
    try {
        const newMedia = new Media({
            access: [userId, friendId],
            collections: [],
        });
        const saved = await newMedia.save();
        return saved;

    } catch (error) {
        console.log(error);
    }
};
module.exports = createNewMedia;