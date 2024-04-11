const Movie = require('../models/movie');
const Actor = require('../models/actor');

module.exports = {};

module.exports.all = async function async (req, res) {
  try {
    const movies = await Movie
      .find()
      .select(['-_id', '-CreatedAt', '-UpdatedAt'])
      .populate('Actors', ['-_id', '-CreatedAt', '-UpdatedAt']);

    return res.status(200).json(movies);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error: error.message });
  }
};

module.exports.getByTitle = async function (req, res) {
  try {
    const { title } = req.params;

    const movie = await Movie
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
};
