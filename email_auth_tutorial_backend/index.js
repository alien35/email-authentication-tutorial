/*  EXPRESS SETUP  */

const express = require('express');
const app = express();

app.use(express.static(__dirname));

const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');

// helps parse the body so the server can understand JSON.
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// sets up session management
const expressSession = session({
  secret: 'this_is_a_secret_that_should_not_be_disclosed',
  resave: false,
  saveUninitialized: false,
});
app.use(expressSession);

// Lots of behind-the-scenes configurations
// happen here to reduce the amount of code
// you have to write in order for express and passport to communicate with each other.
app.use(passport.initialize());
app.use(passport.session());

// cross-origin resource sharing set up
var cors = require('cors');
var corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token', "Access-Control-Allow-Credentials"]
};
app.use(cors(corsOption));

const port = 8000;
app.listen(port, () => console.log('App listening on port ' + port));

const routes = require("./routes");

// database setup
mongoose.connect("mongodb://localhost/SampleDatabase",
  { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/api/v1/', routes);
