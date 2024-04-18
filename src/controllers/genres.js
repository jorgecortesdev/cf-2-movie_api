const express = require('express');
const router = express.Router();
const passport = require('passport');

const Movie = require('../models/movie');

/**
 * @swagger
 * /genres/{name}:
 *  get:
 *    summary: Retrieves information about a specific genre by name.
 *    tags:
 *      - Genre
 *    description: Retrieves information about a specific genre by name.
 *    parameters:
 *      - in: path
 *        name: name
 *        required: true
 *        description: The name of the genre to retrieve.
 *        schema:
 *          type: string
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: A single genre.
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
 *                  example: Genre retrieved successfully
 *                data:
 *                  $ref: '#/components/schemas/GenreResponse'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      500:
 *        $ref: '#/components/responses/ApplicationError'
 */
router.get('/:name', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
  try {
    const { name } = req.params;
    const movie = await Movie.findOne({ 'Genre.Name': name });

    if (movie) {
      return res.sendSuccessResponse('Genre retrieved successfully', movie.Genre, 200);
    }

    return res.sendErrorResponse('No such genre', 404);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
