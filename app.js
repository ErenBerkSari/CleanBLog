const express = require('express');
const ejs = require('ejs');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const pageRoute = require('./routes/pageRoute');
const postRoute = require('./routes/postRoute');
const authRoute = require('./routes/authRoute');
const categoryRoute = require('./routes/categoryRoute');
const authMiddlewares = require('./middlewares/authMiddlewares');

dotenv.config();

const app = express();

// Connect DB
mongoose
  .connect('mongodb://127.0.0.1/cleanblog-test-db')
  .then(() => {
    console.log('DB Connected Succesfuly');
  })
  .catch((err) => {
    console.log(err);
  });

// Template Engine
app.set('view engine', 'ejs');

// Global Variable
global.userIN = null;

// MIDDLEWARE
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(
  session({
    secret: 'my_keyboard_cat',
    resave: false,
    saveUninitialized: true,
  })
);
app.use('*', (req, res, next) => {
  userIN = req.session.userID;
  next();
});
app.use(flash());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});
// ROUTES
app.use('/', pageRoute);
app.use('/post', postRoute);
app.use('/', authRoute);
app.use('/categories', categoryRoute);

const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı.`);
});
