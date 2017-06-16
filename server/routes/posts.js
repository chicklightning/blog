var express     = require("express"),
    router      = express.Router(),
    Post        = require("../models/post"),
    middleware  = require("../middleware");


// SHOW ALL POSTS
router.get("/", function(req, res) {
    // show all posts after getting from db
    
    Post.find({}, function(err, posts) {
        if(err) {
            console.log("Error getting posts from database.");
            return res.redirect("/");
        }
        
        res.render("posts/index", {posts : posts});
    });
});


// NEW POST FORM
router.get("/new", middleware.isAuthenticated, function(req, res) {
    res.render("posts/new");
});


// CREATE NEW POST
router.post("/", middleware.isAuthenticated, function(req, res) {
   // if the user is an authenticated user,
   // then get data from form and make new post
   
   Post.create(req.body.post, function(err, post) {
      if(err) {
          console.log("Unable to create new post: " + err);
          req.flash("error", "Unable to create new post.");
          return res.redirect("/posts");
      }
      else {
          console.log("New post created.");
          req.flash("success", "New post created.");
          
          res.redirect('/posts/' + post._id);
      }
   });
    
});


// SEE POST singular post
router.get("/:id", function(req, res) {
    
    Post.findById(req.params.id, function(err, post) {
        if(err) {
            if( req.params.id != "bootstrap.min.js")
                console.log("Error retrieving post with id: " + req.params.id);
            res.redirect("/posts");
        }
        else {
            res.render("posts/show", {post: post});
        }
    });
});


// EDIT POST FORM
router.get("/:id/edit", middleware.isAuthenticated, function(req, res) {
   // show form to edit post with information already in it
   
   Post.findById(req.params.id, function(err, post) {
       if(err) {
           console.log("Unable to find post with id: " + req.params.id);
           res.redirect("/posts");
       }
       
       else {
           res.render("posts/edit", {post: post});
       }
   });
    
});


// EDIT POST SUBMIT
router.put("/:id", middleware.isAuthenticated, function(req, res) {
    
    // update post from the form
    Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, post) {
        if(err) {
            console.log("Unable to update post with id: " + req.params.id);
            req.flash("error", "Unable to update post, please try again later.");
            res.redirect("/posts");
        }
        else {
            console.log("Updated post with id: " + req.params.id);
            res.redirect("/posts/" + req.params.id);
        }
    });
});


// DELETE POST
router.delete("/:id", middleware.isAuthenticated, function(req, res) {
   // delete singular post
   Post.findByIdAndRemove(req.params.id, function(err) {
       if(err) {
           console.log("Unable to remove post with id: " + req.params.id);
           req.flash("error", "Unable to delete post, please try again later.");
           res.redirect("/posts");
       }
       else {
           console.log("Post deleted.");
           req.flash("success", "Post successfully deleted.");
           res.redirect("/posts");
       }
   });
});


// export
module.exports = router;