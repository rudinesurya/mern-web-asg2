require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('./auth/passport'); // import passport configured with JWT strategy

const { MONGO_URI } = process.env;

// db config
// connect to db
mongoose.connect(MONGO_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


const usersRouter = require('./routes/api/usersRouter');
const profilesRouter = require('./routes/api/profilesRouter');
const jobsRouter = require('./routes/api/jobsRouter');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Passport middleware
app.use(passport.initialize());

app.use('/api/users', usersRouter);
app.use('/api/profiles', profilesRouter);
app.use('/api/jobs', jobsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
