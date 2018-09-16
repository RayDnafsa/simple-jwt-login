var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    hash: String
},
{timestamps: true});

UserSchema.methods.setPassword = function(password) {
    var hash = bcrypt.hashSync(password, 10);
    this.hash = hash;
};

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.hash);
}

UserSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        username: this.username,
        exp: parseInt(expiry.getTime() / 1000)
    }, process.env.JWT_SECRET);
}

var User = mongoose.model('User', UserSchema);
module.exports = User;