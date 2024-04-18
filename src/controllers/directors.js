const express = require('express');
const router = express.Router();
const passport = require('passport');

const Movie = require('../models/movie');

/**
 * @swagger
 * /directors/{name}:
 *  get:
 *    summary: Retrieves information about a specific director by their name.
 *    tags:
 *      - Director
 *    description: Retrieves information about a specific director by their name.
 *    parameters:
 *      - in: path
 *        name: name
 *        required: true
 *        description: The name of the director to retrieve.
 *        schema:
 *          type: string
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: A single director.
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
 *                  example: Director details retrieved successfully
 *                data:
 *                  $ref: '#/components/schemas/DirectorResponse'
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
    const movie = await Movie.findOne({ 'Director.Name': name });

    if (movie) {
      return res.sendSuccessResponse('Director details retrieved successfully', movie.Director, 200);
    }

    return res.sendErrorResponse('No such director', 404);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
