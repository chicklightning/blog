// ------------------ //
// ---DEPENDENCIES--- //
// ------------------ //
var bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    expressSanitizer= require("express-sanitizer"),
    mongoose        = require("mongoose"),
    localStrategy   = require("passport-local"),
    passport        = require("passport"),
    flash           = require("connect-flash"),
    express         = require("express");

// app setup
var app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());


// ------------------ //
// -----MONGOOSE----- //
// ------------------ //
var url = process.env.DATABASEURL || "mongodb://localhost/blog";
mongoose.connect(url);
var Post    = require("./models/post"),
    User    = require("./models/user");


// ------------------ //
// -----PASSPORT----- //
// ------------------ //
app.use(require("express-session")({
   secret: "This shit is so cool",
   resave: false,
   saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.info = req.flash("info");
    next();
});


// ------------------ //
// ------ROUTES------ //
// ------------------ //
var postRoutes      = require("./routes/posts"),
    indexRoutes     = require("./routes/index");

app.use("/", indexRoutes);
app.use("/posts", postRoutes);


// START SERVER
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Blog server started, listening on port " + process.env.PORT + ".");
})