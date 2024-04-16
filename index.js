// dependencies
const express = require("express");
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const swaggerDocs = require('./swagger');

require('dotenv').config()

const app = express();

app.use(logger('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('./responses'));

// mongoose
mongoose.connect(process.env.CONNECTION_URI, {});

let allowedOrigins = [
  'http://localhost:8080'
];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn't found on the list of allowed origins
      let message = `The CORS policy for this application doesn't allow access from origin ${origin}`;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

let auth = require('./auth')(app);

require('./passport');

app.use('/movies', require('./controllers/movies'));
app.use('/genres', require('./controllers/genres'));
app.use('/directors', require('./controllers/directors'));
app.use('/users', require('./controllers/users'));
app.use('/lists', require('./controllers/lists'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  return res.sendErrorResponse(
    'Something broke!',
    500
  );
});

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);

  swaggerDocs(app, port);
});
