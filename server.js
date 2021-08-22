//Import packages and modules
const express = require("express");
const session = require("express-session");
const passport = require("./config/passport");
const db = require("./models");


//Setup PORT
const PORT = process.env.PORT || 8080;

//Create express app and configuring middleware needed for authentication
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Set public as root directory from which to serve static assets. 
app.use(express.static("public"));

//Use Session to keep track of user's login status
//resave-true Forces the session to be saved back to the session store, even if the session was never modified during the request.
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

//requiring routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

//Syncing databse and loggin a message to the user upon successully connection to server 
db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
    });
});
