// dependencies
const express = require("express");
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const { body } = require('express-validator');
const path = require('path');

require('dotenv').config()

const app = express();

app.use(logger('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

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

const users = require('./controllers/users');
const lists = require('./controllers/lists');
const movies = require('./controllers/movies');
const genres = require('./controllers/genres');
const directors = require('./controllers/directors');

/**
 * Retrieves a list of movies.
 *
 * @route GET /movies
 * @returns {object[]} List of movies
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), movies.all);

/**
 * Retrieves information about a specific movie by its title.
 *
 * @route GET /movies/:title
 * @param {string} req.params.title - The title of the movie to retrieve
 * @returns {object} Information about the movie
 */
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), movies.getByTitle);

/**
 * Retrieves information about a specific genre by its name.
 *
 * @route GET /genres/:name
 * @param {string} req.params.name - The name of the genre to retrieve
 * @returns {object} Information about the genre
 */
app.get('/genres/:name', passport.authenticate('jwt', { session: false }), genres.getByName);

/**
 * Retrieves information about a specific director by their name.
 *
 * @route GET /directors/:name
 * @param {string} req.params.name - The name of the director to retrieve.
 * @returns {Object} Information about the director.
 */
app.get('/directors/:name', passport.authenticate('jwt', { session: false }), directors.getByName);

/**
 * Retrieves a list of users.
 *
 * @route GET /users
 * @returns {object[]} List of users
 */
app.get('/users', passport.authenticate('jwt', { session: false }), users.all);

/**
 * Retrieves information about a specific user by their email.
 *
 * @route GET /users/:email
 * @param {string} req.params.email - The email of the user to retrieve.
 * @returns {Object} Information about the user.
 */
app.get('/users/:email', passport.authenticate('jwt', { session: false }), users.getByEmail);

/**
 * Creates a new user.
 *
 * @route POST /users
 * @param {Object} req.body - The data of the new user to be created.
 * @param {string} req.body.name - The name of the new user.
 * @returns {Object} The newly created user.
 */
app.post('/users', [
    body('Name', 'Name is required').isLength({min: 5}),
    body('Password', 'Password is required').not().isEmpty(),
    body('Email', 'Email does not appear to be valid').isEmail()
  ], users.create);

/**
 * Updates an existing user.
 *
 * @route PUT /users/:email
 * @param {string} req.params.email - The email of the user to be updated.
 * @param {Object} req.body - The updated data for the user.
 * @param {string} req.body.name - The new name for the user.
 * @returns {Object} The updated user.
 */
app.put('/users/:email', [
    body('Name', 'Name is required').isLength({min: 5}).optional(),
    body('Password', 'Password is required').not().isEmpty().optional()
  ],
  passport.authenticate('jwt', { session: false }), users.update);

/**
 * Adds a movie to a user's favorite movies list.
 *
 * @route POST /users/:email/movies/:movieId/favorite
 * @param {string} req.params.email - The email of the user.
 * @param {string} req.params.movieId - The id of the movie to be added.
 * @returns {Object} The updated user.
 */
app.post('/lists/:email/favorite/:movieId', passport.authenticate('jwt', { session: false }), lists.addFavorite);

/**
 * Removes a movie from a user's favorite movies list.
 *
 * @route DELETE /users/:email/movies/:movieId/favorite
 * @param {string} req.params.email - The email of the user.
 * @param {string} req.params.movieId - The id of the movie to be removed.
 * @returns {Object} The updated user.
 */
app.delete('/lists/:email/favorite/:movieId', passport.authenticate('jwt', { session: false }), lists.removeFavorite);

/**
 * Adds a movie to a user's watch movies list.
 *
 * @route POST /users/:email/movies/:movieId/watch
 * @param {string} req.params.email - The email of the user.
 * @param {string} req.params.movieId - The id of the movie to be added.
 * @returns {Object} The updated user.
 */
app.post('/lists/:email/watch/:movieId', passport.authenticate('jwt', { session: false }), lists.addToWatch);

/**
 * Removes a movie from a user's watch movies list.
 *
 * @route DELETE /users/:email/movies/:movieId/watch
 * @param {string} req.params.email - The email of the user.
 * @param {string} req.params.movieId - The id of the movie to be removed.
 * @returns {Object} The updated user.
 */
app.delete('/lists/:email/watch/:movieId', passport.authenticate('jwt', { session: false }), lists.removeToWatch);

/**
 * Deletes a user from the system.
 *
 * @route DELETE /users/:id
 * @param {string} req.params.id - The unique identifier of the user to be deleted.
 * @returns {string} Success message indicating the user has been deleted.
 */
app.delete('/users/:email', passport.authenticate('jwt', { session: false }), users.delete);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
