import 'dotenv/config'
import express from 'express';
import session from 'express-session';

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

export default app;