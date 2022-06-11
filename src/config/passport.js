const passport = require('passport');
const User = require('../app/models/user_model');
const LocalStrategy = require('passport-local').Strategy;

// Passport session setup
// used to serialize the user for the session

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

// local sign up
passport.use('local.register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    User.findOne({ 'email': email }, function(err, user) {
            if (err) { return done(err); }
            if (user) {
                return done(null, false, {messages: 'Email đã được sử dụng'});
            }
            var newUser = new User();
            newUser.email = email;
            newUser.password = newUser.encryptPassword(password);
            newUser.save(function(err, result) {
                if(err) { return done(err); }
            })
            return done(null, newUser);
        });
}));

passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    User.findOne({ 'email': email }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
            return done(null, false, {messages: 'Tài khoản không tồn tại'});
        }
        if (!user.validPassword(password)) {
            return done(null, false, {messages: 'Sai mật khẩu'});
        }
        return done(null, user);
    });
}));