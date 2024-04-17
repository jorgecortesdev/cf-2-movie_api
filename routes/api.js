const DirectorsController = require('../src/controllers/directors');
const GenresController = require('../src/controllers/genres');
const MoviesController = require('../src/controllers/movies');
const UsersController = require('../src/controllers/users');
const ListsController = require('../src/controllers/lists')
const AuthController = require('../src/controllers/auth');

function routes(router) {
  router.use('/', AuthController);

  router.use('/directors', DirectorsController);

  router.use('/genres', GenresController);

  router.use('/movies', MoviesController);

  router.use('/users', UsersController);

  router.use('/lists', ListsController);
}

module.exports = routes;
