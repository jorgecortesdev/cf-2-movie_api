const Movie = require('../models/movie');

module.exports = {};

module.exports.getByName = async function (req, res) {
  try {
    const { name } = req.params;
    const movie = await Movie.findOne({ 'Director.Name': name });

    if (movie) {
      return res.status(200).json(movie.Director);
    }

    return res.status(400).json({ error: 'no such director' });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error: error.message });
  }
};
