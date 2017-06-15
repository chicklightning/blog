var middlewareObj   = {};

middlewareObj.isAuthenticated = function(req, res, next) {
    if(req.isAuthenticated()) {
        req.user.username = "Gabrielle";
        return next();
    }
    
    req.flash("error", "You must be logged in to do that.");
    res.redirect("/");
}

module.exports = middlewareObj;