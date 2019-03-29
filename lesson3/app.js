var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// using mongoose js
var mongoose = require('mongoose');
let dev_db_url = 'mongodb://localhost:27017/pt13351';

let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {useNewUrlParser: true, useCreateIndex: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// add custom handlebar helper
var hbs = require('hbs');
hbs.registerHelper('select_options', function(arr, selectname, selectedValue) { 
  let displayStr = `<select class="form-control" name="${selectname}">`;
  for(let i = 0; i < arr.length; i++){
    displayStr += `<option value="${arr[i]._id}"`;
    if(arr[i]._id == selectedValue){
      displayStr += `selected `;
    }
    displayStr += `>${arr[i].name}</option>`;
  }
  displayStr += `</select>`;
  return displayStr;
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
