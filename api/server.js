if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()

const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const path = require('path')
const methodOverride = require('method-override')

// get function from that file
const initializedPassport = require('./passport-config')
// pass const passport to function
initializedPassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

const users = []

// 
app.use(express.static("../../template"))
// tell server to use ejs
app.set('view-engine', 'ejs')
// since we are going to get information from form
// we are going to build an access inside req
app.use(express.urlencoded({extended: false}))
// flash
app.use(flash())
// session
app.use(session({
    // key that wabt to keep secret
    secret: process.env.SESSION_SECRET,
    // save our session variable if nothing has changed
    resave: false,
    // do you want to save an empty value in the session if there is no value
    saveUninitialized: false
}))
app.use(passport.initialize())
// store variable to be persisted across entire session
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/temp', (req, res) => {
    res.sendFile(path.join(__dirname, '../login.html'))
})

app.get('/', checkAuthenticated, (req, res) => {
    // render file
    res.render('index.ejs', {name: req.user.name})
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    // res.render('login.ejs')
    res.sendFile(path.join(__dirname, '../login.html'))
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

// use async for trycatch
app.post('/register', checkNotAuthenticated, async (req, res) => {
    // after req.body correspond to what we put in name=
    try {
        // create hash for password 10 is how long hash we generate
        // await will return after wating for it
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        // now let's psuh these to users variable for store user's data
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            peer: req.body.peer
        })
        // then redirect to login page
        res.redirect('/login')
    } catch (e) {
        res.redirect('/register')
    }
    console.log(users)
})

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

app.listen(3000)