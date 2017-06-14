var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    User        = require("../models/user");


// landing page route
router.get("/", function (req, res) {
    res.render("landing");
});


// registration form
router.get("/register", function(req, res) {
    res.render("register");
});


// registration post
router.post("/register", function(req, res) {
    var newUser = new User({ username: req.body.username });
    
    // create a new user, saving the hashed password instead of the password
    User.register(newUser, req.body.password, function(err, user) {
        // if failure, display flash message and redirect; exit method
        if(err) {
            console.log("Error creating new user: " + err);
            req.flash("error", err.message);
            return res.render("register");
        }
        
        console.log("New user created: " + req.body.username);
        
        // I'm going to be the only one with an account, so...
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to your blog!");
            res.redirect("/posts");
        });
    });
});


// login form
router.get("/login", function (req, res) {
    res.render("login");
});


// posting to login form (logging in)
router.post("/login", passport.authenticate("local", {
    
    // successful login takes you to posts,
    // unsuccessful takes you back to login forms
    
        successRedirect: "/posts",
        failureRedirect: "/login"
    }), function(req, res) {
        console.log("User logged in.");
        req.flash("info", "Welcome back!");
    }
);


// logging out
router.get("/logout", function(req, res) {
   req.logout();
   req.flash("info", "You have been logged out.");
   res.redirect("/");
});

module.exports = router;