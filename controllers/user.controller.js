var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');

// TODO: validate and sanitize input
module.exports.register = async function (req, res) {
    var user = new User();

    user.username = req.body.username;
    user.setPassword(req.body.password);

    await user.save(function (err) {
        var token = user.generateJwt();
        if (err) {
            res.status(400);
            res.json(err);
        } else {
            res.status(200);
            res.json({
                "token": token
            });
        }
    });
}

module.exports.login = async function (req, res) {
    passport.authenticate('local', function (err, user, info) {
        var token;

        if (err) {
            res.status(404).json(err);
            return;
        }

        if (user) {
            token = user.generateJwt();
            res.status(200);
            res.json({
                "token": token
            });
        } else {
            res.status(401).json(info);
        }
    })(req, res);
}

module.exports.patch = async function (req, res) {
    var user = User.findOne({
        'username': req.decoded.username
    }).then(async user => {
        if (user) {
            var msg = '';
            if(req.body.username && (user.username !== req.body.username)) {
                user.username = req.body.username;
                msg += 'Username changed. '
            }
            if(req.body.password && (!user.validPassword(req.body.password))) {
                user.setPassword(req.body.password);
                msg += 'Password changed. '
            }
            await user.save();
            res.status(200).json({
                message: msg
            });
        } else {
            res.status(404).json({
                message: "User details not found."
            });
        }
    });
}