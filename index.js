const express = require("express"),
  morgan = require('morgan');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoose = require('mongoose');

const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;

app.use(morgan('common'));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/cfDB', {});

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

/**
 * Retrieves a list of movies.
 *
 * @route GET /movies
 * @returns {object[]} List of movies
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movies = await Movies
      .find()
      .select(['-_id', '-CreatedAt', '-UpdatedAt'])
      .populate('Actors', ['-_id', '-CreatedAt', '-UpdatedAt']);

    return res.status(200).json(movies);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error: error.message });
  }
});

/**
 * Retrieves information about a specific movie by its title.
 *
 * @route GET /movies/:title
 * @param {string} req.params.title - The title of the movie to retrieve
 * @returns {object} Information about the movie
 */
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { title } = req.params;
    const movie = await Movies
      .findOne({ Title: title })
      .select(['-_id', '-CreatedAt', '-UpdatedAt'])
      .populate('Actors', ['-_id', '-CreatedAt', '-UpdatedAt']);

    if (movie) {
      return res.status(200).json(movie);
    }

    return res.status(400).json({ error: 'no such movie' });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error: error.message });
  }
});

/**
 * Retrieves information about a specific genre by its name.
 *
 * @route GET /genres/:name
 * @param {string} req.params.name - The name of the genre to retrieve
 * @returns {object} Information about the genre
 */
app.get('/genres/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { name } = req.params;
    const movie = await Movies.findOne({ 'Genre.Name': name });

    if (movie) {
      return res.status(200).json(movie.Genre);
    }

    return res.status(400).json({ error: 'no such genre' });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error: error.message });
  }
});

/**
 * Retrieves information about a specific director by their name.
 *
 * @route GET /directors/:name
 * @param {string} req.params.name - The name of the director to retrieve.
 * @returns {Object} Information about the director.
 */
app.get('/directors/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { name } = req.params;
    const movie = await Movies.findOne({ 'Director.Name': name });

    if (movie) {
      return res.status(200).json(movie.Director);
    }

    return res.status(400).json({ error: 'no such director' });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error: error.message });
  }
});

/**
 * Retrieves a list of users.
 *
 * @route GET /users
 * @returns {object[]} List of users
 */
app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
  const users = await Users
      .find()
      .select(['-_id', '-Password', '-CreatedAt', '-UpdatedAt'])
      .populate('FavoriteMovies', ['-_id', '-CreatedAt', '-UpdatedAt', '-Actors', '-Genre', '-Director'])
      .populate('ToWatch', ['-_id', '-CreatedAt', '-UpdatedAt', '-Actors', '-Genre', '-Director']);

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error: error.message });
  }
});

/**
 * Retrieves information about a specific user by their email.
 *
 * @route GET /users/:email
 * @param {string} req.params.email - The email of the user to retrieve.
 * @returns {Object} Information about the user.
 */
app.get('/users/:email', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { email } = req.params;
    const user = await Users
    .findOne({ Email: email })
    .select(['-_id', '-Password', '-CreatedAt', '-UpdatedAt'])
    .populate('FavoriteMovies', ['-_id', '-CreatedAt', '-UpdatedAt', '-Actors', '-Genre', '-Director'])
    .populate('ToWatch', ['-_id', '-CreatedAt', '-UpdatedAt', '-Actors', '-Genre', '-Director']);

    if (user) {
      return res.status(200).json(user);
    }

    return res.status(400).json({ error: 'no such user' });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error: error.message });
  }
});

/**
 * Creates a new user.
 *
 * @route POST /users
 * @param {Object} req.body - The data of the new user to be created.
 * @param {string} req.body.name - The name of the new user.
 * @returns {Object} The newly created user.
 */
app.post('/users', async (req, res) => {
  try {
    const newUser = req.body;

    let user = await Users.findOne({ Email: newUser.Email });

    if (user) {
      return res.status(400).send({ error: `${newUser.Email} already exists`});
    }

    user = await Users.create(
      {
        Email: newUser.Email,
        Name: newUser.Name,
        Password: newUser.Password,
        Birthday: newUser.Birthday
      }
    );

    return res.status(201).json({
      Email: user.Email,
      Name: user.Name,
      Birthday: user.Birthday
    });
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map(value => value.message);
      return res.status(400).json({
        error: message
      });
    }

    return res.status(500).json({ error: error.message });
  }
});

/**
 * Updates an existing user.
 *
 * @route PUT /users/:email
 * @param {string} req.params.email - The email of the user to be updated.
 * @param {Object} req.body - The updated data for the user.
 * @param {string} req.body.name - The new name for the user.
 * @returns {Object} The updated user.
 */
app.put('/users/:email', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if(req.user.Email !== req.params.email) {
    return res.status(400).send('Permission denied');
  }

  try {
    const filter = { Email: req.params.email };
    const options = { new: true };
    let update = {};

    // update name if exists
    if (req.body.Name) {
      update['Name'] = req.body.Name;
    }

    // update password if exists
    if (req.body.Password) {
      update['Password'] = req.body.Password;
    }

    // update birthday if exists
    if (req.body.Birthday) {
      update['Birthday'] = req.body.Birthday;
    }

    const user = await Users.findOneAndUpdate(filter, update, options);

    if (! user) {
      return res.status(400).send({ error: `${req.params.email} was not found` });
    }

    return res.status(200).json({
      Email: user.Email,
      Name: user.Name,
      Birthday: user.Birthday
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error: error.message });
  }
});

/**
 * Adds a movie to a user's favorite movies list.
 *
 * @route POST /users/:email/movies/:movieId/favorite
 * @param {string} req.params.email - The email of the user.
 * @param {string} req.params.movieId - The id of the movie to be added.
 * @returns {Object} The updated user.
 */
app.post('/users/:email/movies/:movieId/favorite', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if(req.user.Email !== req.params.email) {
    return res.status(400).send('Permission denied');
  }

  try {
    const filter = { Email: req.params.email };
    const options = { new: true };
    const update = { $push: { FavoriteMovies: req.params.movieId } };

    const user = await Users
      .findOneAndUpdate(filter, update, options)
      .select(['-_id', '-Password', '-CreatedAt', '-UpdatedAt'])
      .populate('FavoriteMovies', ['-_id', '-CreatedAt', '-UpdatedAt', '-Actors', '-Genre', '-Director'])
      .populate('ToWatch', ['-_id', '-CreatedAt', '-UpdatedAt', '-Actors', '-Genre', '-Director']);

    if (! user) {
      return res.status(400).send({ error: `${req.params.email} was not found` });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error: error.message });
  }
});

/**
 * Removes a movie from a user's favorite movies list.
 *
 * @route DELETE /users/:email/movies/:movieId/favorite
 * @param {string} req.params.email - The email of the user.
 * @param {string} req.params.movieId - The id of the movie to be removed.
 * @returns {Object} The updated user.
 */
app.delete('/users/:email/movies/:movieId/favorite', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if(req.user.Email !== req.params.email) {
    return res.status(400).send('Permission denied');
  }

  try {
    const filter = { Email: req.params.email };
    const options = { new: true };
    const update = { $pull: { FavoriteMovies: req.params.movieId } };

    const user = await Users
      .findOneAndUpdate(filter, update, options)
      .select(['-_id', '-Password', '-CreatedAt', '-UpdatedAt'])
      .populate('FavoriteMovies', ['-_id', '-CreatedAt', '-UpdatedAt', '-Actors', '-Genre', '-Director'])
      .populate('ToWatch', ['-_id', '-CreatedAt', '-UpdatedAt', '-Actors', '-Genre', '-Director']);

    if (! user) {
      return res.status(400).send({ error: `${req.params.email} was not found` });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error: error.message });
  }
});

/**
 * Adds a movie to a user's watch movies list.
 *
 * @route POST /users/:email/movies/:movieId/watch
 * @param {string} req.params.email - The email of the user.
 * @param {string} req.params.movieId - The id of the movie to be added.
 * @returns {Object} The updated user.
 */
app.post('/users/:email/movies/:movieId/watch', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if(req.user.Email !== req.params.email) {
    return res.status(400).send('Permission denied');
  }

  try {
    const filter = { Email: req.params.email };
    const options = { new: true };
    const update = { $push: { ToWatch: req.params.movieId } };

    const user = await Users
      .findOneAndUpdate(filter, update, options)
      .select(['-_id', '-Password', '-CreatedAt', '-UpdatedAt'])
      .populate('FavoriteMovies', ['-_id', '-CreatedAt', '-UpdatedAt', '-Actors', '-Genre', '-Director'])
      .populate('ToWatch', ['-_id', '-CreatedAt', '-UpdatedAt', '-Actors', '-Genre', '-Director']);

    if (! user) {
      return res.status(400).send({ error: `${req.params.email} was not found` });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error: error.message });
  }
});

/**
 * Removes a movie from a user's watch movies list.
 *
 * @route DELETE /users/:email/movies/:movieId/watch
 * @param {string} req.params.email - The email of the user.
 * @param {string} req.params.movieId - The id of the movie to be removed.
 * @returns {Object} The updated user.
 */
app.delete('/users/:email/movies/:movieId/watch', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if(req.user.Email !== req.params.email) {
    return res.status(400).send('Permission denied');
  }

  try {
    const filter = { Email: req.params.email };
    const options = { new: true };
    const update = { $pull: { ToWatch: req.params.movieId } };

    const user = await Users
      .findOneAndUpdate(filter, update, options)
      .select(['-_id', '-Password', '-CreatedAt', '-UpdatedAt'])
      .populate('FavoriteMovies', ['-_id', '-CreatedAt', '-UpdatedAt', '-Actors', '-Genre', '-Director'])
      .populate('ToWatch', ['-_id', '-CreatedAt', '-UpdatedAt', '-Actors', '-Genre', '-Director']);

    if (! user) {
      return res.status(400).send({ error: `${req.params.email} was not found` });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error: error.message });
  }
});

/**
 * Deletes a user from the system.
 *
 * @route DELETE /users/:id
 * @param {string} req.params.id - The unique identifier of the user to be deleted.
 * @returns {string} Success message indicating the user has been deleted.
 */
app.delete('/users/:email', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if(req.user.Email !== req.params.email) {
    return res.status(400).send('Permission denied');
  }

  try {
    const { email } = req.params;

    const user = await Users.findOneAndDelete({ Email: email });

    if (!user) {
      return res.status(400).send({ error: `${email} was not found` });
    }

    return res.status(200).send({ message: `User ${email} was deleted` });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error: error.message });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
