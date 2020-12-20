// to use local version of passport
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialized(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        // authenticate user by email it will return user by email or null if no user
        const user = getUserByEmail(email)
        if (user == null) {
            return done(null, false, { message: 'No user with that email' })
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                // password user did not match
                return done(null, false, { message: 'Password incorrect' })
            }
        } catch {
            return done(e)
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}

module.exports = initialized