const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    desc: {
        type: String,
    },
    img: {
        data: Buffer,
        contentType: String
    },
    comments: {
        type: String,
    },

});

const Post = new mongoose.model('Post', postSchema);

module.exports = Post
