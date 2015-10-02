var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
//temporary data store
var users = {};
module.exports = function(passport){

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        //Tell passport which id to use for user
        console.log('serializing user:', user.username);
        done(null, user.username);
    });

    passport.deserializeUser(function(username, done) {

        return done(null, users[username]);

    });

    passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {

            //Check if user exists
            if(!users[username]){
                return done('This email-id is not registered', false);
            }

            //Check if password is valid
            if(!isValidPassword(users[username], password)){
                return done('Invalid password', false);
            }
            console.log('Successfully signed in.');
            return done(null, users[username]);
        }
    ));

    passport.use('signup', new LocalStrategy({
                passReqToCallback : true // allows us to pass back the entire request to the callback
            },
            function(req, username, password, done) {

                //Check if user already exists
                if(users[username]){
                    return done('Username already exists', false);
                }

                //Add user to database
                users[username] = {
                    username: username,
                    password: createHash(password)
                };
                console.log(users[username].username + ' registration successful.');
                return done(null, users[username]);

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