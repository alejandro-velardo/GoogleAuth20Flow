const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./auth');

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

const app = express();
app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>')
});

app.get('/auth/google', 
passport.authenticate('google', { scope: ['email', 'profile'] })
);

app.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/private',
        failureRedirect: '/auth/failure'
    })
)

app.get('auth/failure', (req, res) => {
    res.send('Something went wrong...')
})

app.get('/private', isLoggedIn, 
    (req, res) => {
        res.send(`Welcome, ${req.user.displayName}! This is a private route.`)
    }
);

app.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err);
        }
        req.session.destroy();
        res.send("Goodbye.");
    });
    
})
app.listen(5001, () => console.log('App listening on port 5001.'));