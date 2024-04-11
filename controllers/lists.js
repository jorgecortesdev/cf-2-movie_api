const User = require('../models/user');

module.exports = {};

module.exports.addFavorite = async function async (req, res) {
  if(req.user.Email !== req.params.email) {
    return res.status(400).send('Permission denied');
  }

  try {
    const filter = { Email: req.params.email };
    const options = { new: true };
    const update = { $push: { FavoriteMovies: req.params.movieId } };

    const user = await User
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
};

module.exports.removeFavorite = async function (req, res) {
  if(req.user.Email !== req.params.email) {
    return res.status(400).send('Permission denied');
  }

  try {
    const filter = { Email: req.params.email };
    const options = { new: true };
    const update = { $pull: { FavoriteMovies: req.params.movieId } };

    const user = await User
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
};

module.exports.addToWatch = async function (req, res) {
  if(req.user.Email !== req.params.email) {
    return res.status(400).send('Permission denied');
  }

  try {
    const filter = { Email: req.params.email };
    const options = { new: true };
    const update = { $push: { ToWatch: req.params.movieId } };

    const user = await User
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
};

module.exports.removeToWatch = async function (req, res) {
  if(req.user.Email !== req.params.email) {
    return res.status(400).send('Permission denied');
  }

  try {
    const filter = { Email: req.params.email };
    const options = { new: true };
    const update = { $pull: { ToWatch: req.params.movieId } };

    const user = await User
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
};
