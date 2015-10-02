var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

//Database
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Phone = mongoose.model('Phone');

module.exports = function(passport){

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        //Tell passport which id to use for user
        console.log('serializing user:', user._id);
        return done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {

        User.findById(id,function(err, user){
            if(err){
                return done(err, false);
            }
            if(!user){
                return done('User not found.', false);
            }
            //We found the user object provide it back to passport
            return done(null, user);
        });

    });

    passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {

            //Check if user exists
            User.findOne({username: username}, function (err, user) {
                if (err) {
                    return done(err, false);
                }
                if (!user) {
                    return done('User' + username + 'not found!', false);
                }
                if (!isValidPassword(user, password)) {
                    //Wrong password
                    return done("Incorrect password", false);
                }

                return done(null, user);
            });
        })
    );

    passport.use('signup', new LocalStrategy({
                passReqToCallback : true // allows us to pass back the entire request to the callback
            },
            function(req, username, password, done) {

                //Check if user already exists
                User.findOne({username: username}, function(err, user){
                    if(err){
                        return done(err, false);
                    }
                    if(user){
                        //We have already signed this user up
                        return done('Username already taken', false);
                    }
                    var user = new User();
                    user.username = username,
                    user.password = createHash(password)

                    user.save(function(err, user){
                        if(err){
                            return done(err, false);
                        }
                        console.log('Successfully signed up user' + username);

                        return done(null, user);
                    });

                });

            })
    );

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    };
    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };

};