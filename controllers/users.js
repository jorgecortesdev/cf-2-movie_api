const User = require('../models/user');
const { validationResult } = require('express-validator');

module.exports = {};

module.exports.all = async function (req, res) {
  try {
    const users = await User
      .find()
      .select(['-_id', '-Password', '-CreatedAt', '-UpdatedAt'])
      .populate('FavoriteMovies', ['-_id', '-CreatedAt', '-UpdatedAt', '-Actors', '-Genre', '-Director'])
      .populate('ToWatch', ['-_id', '-CreatedAt', '-UpdatedAt', '-Actors', '-Genre', '-Director']);

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error: error.message });
  }
};

module.exports.getByEmail = async function (req, res) {
  try {
    const { email } = req.params;

    const user = await User
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
};

module.exports.create = async function (req, res) {
    try {
      // check validation object for errors
      let errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array() });
      }

      const newUser = req.body;

      let hashedPassword = User.hashPassword(newUser.Password);

      let user = await User.findOne({ Email: newUser.Email });

      if (user) {
        return res.status(400).send({ error: `${newUser.Email} already exists`});
      }

      user = await User.create(
        {
          Email: newUser.Email,
          Name: newUser.Name,
          Password: hashedPassword,
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
};

module.exports.update = async function (req, res) {
  if(req.user.Email !== req.params.email) {
    return res.status(400).send('Permission denied');
  }

  // check validation object for errors
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array() });
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

    const user = await User.findOneAndUpdate(filter, update, options);

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
};

module.exports.delete = async function (req, res) {
  if(req.user.Email !== req.params.email) {
    return res.status(400).send('Permission denied');
  }

  try {
    const { email } = req.params;

    const user = await User.findOneAndDelete({ Email: email });

    if (!user) {
      return res.status(400).send({ error: `${email} was not found` });
    }

    return res.status(200).send({ message: `User ${email} was deleted` });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error: error.message });
  }
};

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
