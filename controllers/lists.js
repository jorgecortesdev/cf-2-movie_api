const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/user');

/**
 * @swagger
 * /lists/{email}/favorite/{movieId}:
 *  post:
 *    summary: Add a movie to user's favorite list.
 *    tags:
 *      - List
 *    description: Add a movie to user's favorite list.
 *    parameters:
 *      - in: path
 *        name: email
 *        required: true
 *        description: The email of the user.
 *        schema:
 *          type: string
 *      - in: path
 *        name: movieId
 *        required: true
 *        description: The id of the movie.
 *        schema:
 *          type: string
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: The updated user.
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
 *                  example: User updated successfully
 *                data:
 *                  $ref: '#/components/schemas/UserResponse'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/PermissionDenied'
 *      500:
 *        $ref: '#/components/responses/ApplicationError'
 */
router.post('/:email/favorite/:movieId', passport.authenticate('jwt', { session: false }), async function (req, res) {
  if(req.user.Email !== req.params.email) {
    return res.sendErrorResponse(
      'Permission denied',
      403
    );
  }

  try {
    const filter = { Email: req.params.email };
    const options = { new: true };
    const update = { $push: { FavoriteMovies: req.params.movieId } };

    const user = await User
      .findOneAndUpdate(filter, update, options)
      .select(['-_id', '-Password', '-CreatedAt', '-UpdatedAt'])
      .populate('FavoriteMovies', ['-CreatedAt', '-UpdatedAt', '-Actors', '-Genre', '-Director'])
      .populate('ToWatch', ['-CreatedAt', '-UpdatedAt', '-Actors', '-Genre', '-Director']);

    return res.sendSuccessResponse(
      'User updated successfully',
      user,
      200
    );
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /lists/{email}/favorite/{movieId}:
 *  delete:
 *    summary: Remove a movie from user's favorite list.
 *    tags:
 *      - List
 *    description: Remove a movie from user's favorite list.
 *    parameters:
 *      - in: path
 *        name: email
 *        required: true
 *        description: The email of the user.
 *        schema:
 *          type: string
 *      - in: path
 *        name: movieId
 *        required: true
 *        description: The id of the movie.
 *        schema:
 *          type: string
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: The updated user.
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
 *                  example: User updated successfully
 *                data:
 *                  $ref: '#/components/schemas/UserResponse'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/PermissionDenied'
 *      500:
 *        $ref: '#/components/responses/ApplicationError'
 */
router.delete('/:email/favorite/:movieId', passport.authenticate('jwt', { session: false }), async function (req, res) {
  if(req.user.Email !== req.params.email) {
    return res.sendErrorResponse(
      'Permission denied',
      403
    );
  }

  try {
    const filter = { Email: req.params.email };
    const options = { new: true };
    const update = { $pull: { FavoriteMovies: req.params.movieId } };

    const user = await User
      .findOneAndUpdate(filter, update, options)
      .select(['-_id', '-Password', '-CreatedAt', '-UpdatedAt'])
      .populate('FavoriteMovies', ['-CreatedAt', '-UpdatedAt', '-Actors', '-Genre', '-Director'])
      .populate('ToWatch', ['-CreatedAt', '-UpdatedAt', '-Actors', '-Genre', '-Director']);

    return res.sendSuccessResponse(
      'User updated successfully',
      user,
      200
    );
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /lists/{email}/watch/{movieId}:
 *  post:
 *    summary: Add a movie to user's watch list.
 *    tags:
 *      - List
 *    description: Add a movie to user's watch list.
 *    parameters:
 *      - in: path
 *        name: email
 *        required: true
 *        description: The email of the user.
 *        schema:
 *          type: string
 *      - in: path
 *        name: movieId
 *        required: true
 *        description: The id of the movie.
 *        schema:
 *          type: string
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: The updated user.
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
 *                  example: User updated successfully
 *                data:
 *                  $ref: '#/components/schemas/UserResponse'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/PermissionDenied'
 *      500:
 *        $ref: '#/components/responses/ApplicationError'
 */
router.post('/:email/watch/:movieId', passport.authenticate('jwt', { session: false }), async function (req, res) {
  if(req.user.Email !== req.params.email) {
    return res.sendErrorResponse(
      'Permission denied',
      403
    );
  }

  try {
    const filter = { Email: req.params.email };
    const options = { new: true };
    const update = { $push: { ToWatch: req.params.movieId } };

    const user = await User
      .findOneAndUpdate(filter, update, options)
      .select(['-_id', '-Password', '-CreatedAt', '-UpdatedAt'])
      .populate('FavoriteMovies', ['-CreatedAt', '-UpdatedAt', '-Actors', '-Genre', '-Director'])
      .populate('ToWatch', ['-CreatedAt', '-UpdatedAt', '-Actors', '-Genre', '-Director']);

    return res.sendSuccessResponse(
      'User updated successfully',
      user,
      200
    );
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /lists/{email}/watch/{movieId}:
 *  delete:
 *    summary: Remove a movie from user's watch list.
 *    tags:
 *      - List
 *    description: Remove a movie from user's watch list.
 *    parameters:
 *      - in: path
 *        name: email
 *        required: true
 *        description: The email of the user.
 *        schema:
 *          type: string
 *      - in: path
 *        name: movieId
 *        required: true
 *        description: The id of the movie.
 *        schema:
 *          type: string
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: The updated user.
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
 *                  example: User updated successfully
 *                data:
 *                  $ref: '#/components/schemas/UserResponse'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/PermissionDenied'
 *      500:
 *        $ref: '#/components/responses/ApplicationError'
 */
router.delete('/:email/watch/:movieId', passport.authenticate('jwt', { session: false }), async function (req, res) {
  if(req.user.Email !== req.params.email) {
    return res.sendErrorResponse(
      'Permission denied',
      403
    );
  }

  try {
    const filter = { Email: req.params.email };
    const options = { new: true };
    const update = { $pull: { ToWatch: req.params.movieId } };

    const user = await User
      .findOneAndUpdate(filter, update, options)
      .select(['-_id', '-Password', '-CreatedAt', '-UpdatedAt'])
      .populate('FavoriteMovies', ['-CreatedAt', '-UpdatedAt', '-Actors', '-Genre', '-Director'])
      .populate('ToWatch', ['-CreatedAt', '-UpdatedAt', '-Actors', '-Genre', '-Director']);

    return res.sendSuccessResponse(
      'User updated successfully',
      user,
      200
    );
  } catch (error) {
    next(error);
  }
});

module.exports = router;
