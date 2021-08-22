// Import packages and modules 

const passport = require("passport");
const LocalStrategy = require("passport-local");
const db = require("../models");

//Set up passport Local Stragey (use pasport LocalStrategy) and login with user's email and password 

passport.use(new LocalStrategy(
    //user sign in with an email rather than with a username
    {
        usernameField: "email"
    },
    ((email, password, done) => {
        //when a user click LOGIN button, this code runs
        db.User.findOne({
            where: {
                email
            }
        }).then((dbUser) => {
            //This cb function will find the correct user from the database and pass it as a closure variable into the callback done(err,user);
            //So the code in the passport.session() can replace the 'user' value in the req object and pass on to the next middleware in the pile
            
            //If there is no user in the database with given email
            if (!dbUser) {
                return done(null, false, {message: "Incorrect email."});
            }
            //if there is matching email but no matching password in the database
            if (!dbUser.validPassword(password)) {
                return done(null, false, {message: "Incorrect password."});
            } 
            //If find matching email and password, return the user to the route handler
            return done(null, dbUser);
        });

    })
));

//Sequelize serialize and deserialize user in order to help keep authentication state across HTTP requests 
//Boiler plate needed to make it all work 

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
});

//Export the configured passport 
module.exports = passport; 