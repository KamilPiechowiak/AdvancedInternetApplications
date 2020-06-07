const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const User = require("../../models/User")

passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    },
    (email, password, done) => {
        console.log(email + " " + password)
        User.findOne({ where: {email: email} })
            .then(async user => {
                if (!user || !(user.validatePassword(password))) {once
                    return done(null, false)
                }
                user.activateToken = null
                user.resetPasswordToken = null
                user.save()
                return done(null, user)
            })
            .catch(err => {return done(err)})
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findOne({where: {id: id}})
        .then(user => done(user))
        .catch(err => done(err))
})



module.exports = passport