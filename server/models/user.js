var mongoose                = require("mongoose"),
    passportLocalMongoose   = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String
});

// use mongoose for passport to store hashes instead of actual passwords
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);