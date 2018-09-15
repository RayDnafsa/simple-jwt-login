var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy({
        usernameField: 'username',
    },
    function (username, password, done) {
        User.findOne({
            'username': username
        }).then(user => {
            if (!user || !user.validPassword(password)) {
                done(null, false, {
                    message: "Invalid username/password"
                });
            } else {
                done(null, user);
            }
        });
    }));