const express = require("express"),
  morgan = require('morgan');

const app = express();

const topMovies = [
  {
    title: "The Dark Knight",
    director: "Christopher Nolan"
  },
  {
    title: "Avengers: Endgame",
    director: "Anthony Russo, Joe Russo"
  },
  {
    title: "Spider-Man: Into the Spider-Verse",
    director: "Bob Persichetti, Peter Ramsey, Rodney Rothman"
  }
];

app.use(morgan('common'));

app.use(express.static('public'));

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to myFlix API!');
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
