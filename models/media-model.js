const mongoose = require("mongoose");



const MediaSchema = mongoose.Schema({
    access: [String, String],

    collections: [
        {
            mediaId: String,
            hasCopy: [String, String]
        }
    ],

});

const Media = mongoose.model('media', MediaSchema);

module.exports = Media;