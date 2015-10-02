var mongoose = require('mongoose');
var User = mongoose.model('User');
var Post = mongoose.model('Post');
var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');



module.exports = function (passport) {
    
    // Passport needs to be able to serialize and deserialize user to
    passport.serializeUser(function (user, done) {
        // tell pasport which id to use
        console.log('serializing user:', user.username);
        //return the unique id for the user
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        
        User.findById(id, function (err, user) {
            if (err) {
                return done(err, false);
            }

            if (!user) {
                return done('user not found', false);
            }

            done(err, user);
        });
    });

    passport.use('login', new LocalStrategy({
            passReqToCallback: true
        },
        function (req, username, password, done) {
            User.findOne({ 'username': username }, function (err, user) {
                if (err) {
                    return done(err);
                }
            
                //if there is no user with this username
                if (!user) {
                    console.log('User Not Found with username ' + username);
                    return done(null, false);
                }

                if (!isValidPassword(user, password)) {
                    //wrong password!
                    console.log('Invalid Password');
                    return done(null, false);
                }

                return done(null, user);
            });
        }
    ));

    passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allow us to pass back the entity
        },
        function (req, username, password, done) {
            //check if the user already exists
            User.findOne({ 'username' : username }, function (err, user) {
                if (err) {
                    console.log('Error in SignUp: ' + err);
                    return done(err, false);
                }
            
                if (user) {
                    //we have already signed this user up
                    console.log('User already exists with username: ' + username);
                    return done(null, false);
                } else {
                    var user = new User();
                
                    user.username = username;
                    user.password = createHash(password);
                    user.save(function (err, user) {
                        if (err) {
                            return done(err, false);
                        }
                        console.log('sucessfully signed up user' + username);
                        return done(null, user);
                    }); 
                }
            });
        } 
    ));

    var isValidPassword = function (user, password) {
        return bCrypt.compareSync(password, user.password);  
    };

    var createHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };
};
