const express = require("express"),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const app = express();

app.use(bodyParser.json());
app.use(morgan('common'));
app.use(express.static('public'));

let users = [
  {
    id: 1,
    name: "Jane",
    favoriteMovies: []
  },
  {
    id: 2,
    name: "John",
    favoriteMovies: []
  }
];

let movies = [
  {
    Title: "The Dark Knight",
    Director: {
      Name: "Christopher Nolan",
      Bio: "Christopher Nolan is a British-American film director, producer, and screenwriter. He is one of the highest-grossing directors in history, known for his visually stunning and intellectually complex films.",
      Birth: "July 30, 1970"
    },
    Description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    Feature: false,
    ImageURL: "https://www.example.com/the_dark_knight_poster.jpg",
    Genre: {
      Name: "Action",
      Description: "Movies intended to provide an exciting experience, usually involving fast-paced sequences, violence, and intense situations."
    }
  },
  {
    Title: "Avengers: Endgame",
    Director: {
      Name: "Anthony Russo",
      Bio: "Anthony Russo is an American film and television director, best known for his work with his brother, Joe Russo. Together, they have directed several successful films in the Marvel Cinematic Universe.",
      Birth: "February 3, 1970"
    },
    Description: "After the devastating events of Avengers: Infinity War (2018), the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
    Feature: false,
    ImageURL: "https://www.example.com/avengers_endgame_poster.jpg",
    Genre: {
      Name: "Sci-Fi",
      Description: "Movies that explore speculative concepts, often involving futuristic technology, outer space, and scientific advancements."
    }
  },
  {
    Title: "Spider-Man: Into the Spider-Verse",
    Director: {
      Name: "Bob Persichetti",
      Bio: "Bob Persichetti is an American animator and film director, known for his work in the animation industry. He has contributed to several successful animated films, including Spider-Man: Into the Spider-Verse.",
      Birth: "Unknown"
    },
    Description: "Teen Miles Morales becomes the Spider-Man of his universe, and must join with five spider-powered individuals from other dimensions to stop a threat for all realities.",
    Feature: false,
    ImageURL: "https://www.example.com/spider_man_into_the_spider_verse_poster.jpg",
    Genre: {
      Name: "Animation",
      Description: "Movies created through the process of animation, often featuring colorful visuals, imaginative storytelling, and fantastical elements."
    }
  }
];

/**
 * Retrieves a list of movies.
 *
 * @route GET /movies
 * @returns {object[]} List of movies
 */
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

/**
 * Retrieves information about a specific movie by its title.
 *
 * @route GET /movies/:title
 * @param {string} req.params.title - The title of the movie to retrieve
 * @returns {object} Information about the movie
 */
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find(movie => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('no such movie');
  }
});

/**
 * Retrieves information about a specific genre by its name.
 *
 * @route GET /genres/:name
 * @param {string} req.params.name - The name of the genre to retrieve
 * @returns {object} Information about the genre
 */
app.get('/genres/:name', (req, res) => {
  const { name } = req.params;
  const movie = movies.find(movie => movie.Genre.Name === name);

  if (movie) {
    res.status(200).json(movie.Genre);
  } else {
    res.status(400).send('no such genre');
  }
});

/**
 * Retrieves information about a specific director by their name.
 *
 * @route GET /directors/:name
 * @param {string} req.params.name - The name of the director to retrieve.
 * @returns {Object} Information about the director.
 */
app.get('/directors/:name', (req, res) => {
  const { name } = req.params;
  const movie = movies.find(movie => movie.Director.Name === name);

  if (movie) {
    res.status(200).json(movie.Director);
  } else {
    res.status(400).send('no such director');
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
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send('users need names');
  }
});

/**
 * Updates an existing user.
 *
 * @route PUT /users/:id
 * @param {string} req.params.id - The unique identifier of the user to be updated.
 * @param {Object} req.body - The updated data for the user.
 * @param {string} req.body.name - The new name for the user.
 * @returns {Object} The updated user.
 */
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find(user => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('no such user');
  }
});

/**
 * Adds a movie to a user's favorite movies list.
 *
 * @route POST /users/:id/movies/:title
 * @param {string} req.params.id - The unique identifier of the user.
 * @param {string} req.params.title - The title of the movie to be added.
 * @returns {string} Success message indicating the movie has been added to the user's list.
 */
app.post('/users/:id/movies/:title', (req, res) => {
  const { id, title } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies.push(title);
    res.status(200).send(`${title} has been added to user ${id}'s array`);
  } else {
    res.status(400).send('no such user');
  }
});

/**
 * Removes a movie from a user's favorite movies list.
 *
 * @route DELETE /users/:id/movies/:title
 * @param {string} req.params.id - The unique identifier of the user.
 * @param {string} req.params.title - The title of the movie to be removed.
 * @returns {string} Success message indicating the movie has been removed from the user's list.
 */
app.delete('/users/:id/movies/:title', (req, res) => {
  const { id, title } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(currentTitle => currentTitle !== title);
    res.status(200).send(`${title} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send('no such user');
  }
});

/**
 * Deletes a user from the system.
 *
 * @route DELETE /users/:id
 * @param {string} req.params.id - The unique identifier of the user to be deleted.
 * @returns {string} Success message indicating the user has been deleted.
 */
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    users = users.filter(user => user.id != id);
    res.status(200).send(`User ${id} has been deleted`);
  } else {
    res.status(400).send('no such user');
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
