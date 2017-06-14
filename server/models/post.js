var mongoose    = require("mongoose");

// Blog post schema
// each post has a video, image clip, a short caption, a date, and number of likes

var postSchema = new mongoose.Schema({
    
    image: String,
    caption: String,
    videoURL: String,
    timeStamp: {
        type: Date,
        default: Date.now()
    },
    likes: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("Post", postSchema);