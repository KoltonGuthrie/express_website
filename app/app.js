import 'dotenv/config'
import express from 'express';
import session from 'express-session';
import { isLoggedIn } from './utils.js'
import { isValidCredentials } from './database/credentials.js';

const app = express();

// TODO: Save into a database
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false, 
    saveUninitialized: false, 
    cookie: { maxAge: 1000 * 60 * 60 } // 1-hour session
}));

app.use(express.static('./app/public'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs');
app.set('views', './app/pages');

app.get('/', (req, res) => {
    res.send("Hello, World!");
});

app.get('/login', (req, res) => {
    if (isLoggedIn(req))
        return res.redirect('/');

    res.render('login/index');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (isValidCredentials(username, password)) {
        req.session.username = username;
        res.send('Login successful');
    } else {
        res.send('Invalid credentials');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.send("Logged out.");
});

export default app;