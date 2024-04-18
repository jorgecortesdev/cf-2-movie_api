const express = require('express');
const router = express.Router();
const passport = require('passport');

const Movie = require('../models/movie');
// eslint-disable-next-line no-unused-vars
const Actor = require('../models/actor');

/**
 * @swagger
 * /movies:
 *  get:
 *    summary: Retrieves all movies.
 *    tags:
 *      - Movie
 *    description: Retrieves all movies.
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: An array of movies.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                message:
 *                  type: string
 *                  example: Movies retrieved successfully
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/MovieResponse'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      500:
 *        $ref: '#/components/responses/ApplicationError'
 */
router.get('/', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
  try {
    const movies = await Movie.find()
      .select(['-CreatedAt', '-UpdatedAt'])
      .populate('Actors', ['-_id', '-CreatedAt', '-UpdatedAt']);

    return res.sendSuccessResponse('Movies retrieved successfully', movies, 200);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /movies/{title}:
 *  get:
 *    summary: Retrieves information about a specific movie by their title.
 *    tags:
 *      - Movie
 *    description: Retrieves information about a specific movie by their title.
 *    parameters:
 *      - in: path
 *        name: title
 *        required: true
 *        description: The title of the movie to retrieve.
 *        schema:
 *          type: string
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: A single movie.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                message:
 *                  type: string
 *                  example: Movie retrieved successfully
 *                data:
 *                  $ref: '#/components/schemas/MovieResponse'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      500:
 *        $ref: '#/components/responses/ApplicationError'
 */
router.get('/:title', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
  try {
    const { title } = req.params;

    const movie = await Movie.findOne({ Title: title })
      .select(['-CreatedAt', '-UpdatedAt'])
      .populate('Actors', ['-_id', '-CreatedAt', '-UpdatedAt']);

    if (movie) {
      return res.sendSuccessResponse('Movie retrieved successfully', movie, 200);
    }

    return res.sendErrorResponse('No such movie', 404);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
