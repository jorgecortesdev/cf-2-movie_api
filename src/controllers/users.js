const express = require('express');
const router = express.Router();
const passport = require('passport');
const { body, validationResult } = require('express-validator');

const User = require('../models/user');

/**
 * @swagger
 * /users:
 *  get:
 *    tags:
 *      - User
 *    summary: Retrieves all users.
 *    description: Retrieves all users.
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: An array of users.
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
 *                  example: Users retrieved successfully
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/UserResponse'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      500:
 *        $ref: '#/components/responses/ApplicationError'
 */
router.get('/', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
  try {
    const users = await User.find()
      .select(['-_id', '-Password', '-CreatedAt', '-UpdatedAt'])
      .populate('FavoriteMovies', ['-CreatedAt', '-UpdatedAt', '-Actors', '-Genre', '-Director'])
      .populate('ToWatch', ['-CreatedAt', '-UpdatedAt', '-Actors', '-Genre', '-Director']);

    return res.sendSuccessResponse('Users retrieved successfully', users, 200);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /users/{email}:
 *  get:
 *    tags:
 *      - User
 *    summary: Retrieves information about a specific user by their email.
 *    description: Retrieves information about a specific user by their email.
 *    parameters:
 *      - in: path
 *        name: email
 *        required: true
 *        description: The email of the user to retrieve.
 *        schema:
 *          type: string
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: A single user.
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
 *                  example: User retrieved successfully
 *                data:
 *                  $ref: '#/components/schemas/UserResponse'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      500:
 *        $ref: '#/components/responses/ApplicationError'
 */
router.get('/:email', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
  try {
    const { email } = req.params;

    const user = await User.findOne({ Email: email })
      .select(['-_id', '-Password', '-CreatedAt', '-UpdatedAt'])
      .populate('FavoriteMovies', ['-CreatedAt', '-UpdatedAt', '-Actors', '-Genre', '-Director'])
      .populate('ToWatch', ['-CreatedAt', '-UpdatedAt', '-Actors', '-Genre', '-Director']);

    if (user) {
      return res.sendSuccessResponse('User retrieved successfully', user, 200);
    }

    return res.sendErrorResponse('No such user', 404);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /users:
 *  post:
 *    tags:
 *      - User
 *    summary: Create a new user.
 *    description: Create a new user.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CreateUserInput'
 *    responses:
 *      200:
 *        description: The new user.
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
 *                  example: User created successfully.
 *                data:
 *                  $ref: '#/components/schemas/User'
 *      400:
 *        $ref: '#/components/responses/UserExists'
 *      422:
 *        $ref: '#/components/responses/ValidationError'
 *      500:
 *        $ref: '#/components/responses/ApplicationError'
 */
router.post(
  '/',
  [
    body('Name', 'Name is required').isLength({ min: 5 }),
    body('Password', 'Password is required').not().isEmpty(),
    body('Email', 'Email does not appear to be valid').isEmail(),
  ],
  async function (req, res, next) {
    try {
      // Check validation object for errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendErrorResponse(
          errors.array(),
          422, // Unprocessable Content
        );
      }

      const newUser = req.body;

      let user = await User.findOne({ Email: newUser.Email });
      if (user) {
        return res.sendErrorResponse(
          'User already exists.',
          400, // Bad Request
        );
      }

      const hashedPassword = User.hashPassword(newUser.Password);
      user = await User.create({
        Email: newUser.Email,
        Name: newUser.Name,
        Password: hashedPassword,
        Birthday: newUser.Birthday,
      });

      return res.sendSuccessResponse(
        'User created successfully.',
        {
          Email: user.Email,
          Name: user.Name,
          Birthday: user.Birthday,
        },
        201,
      );
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /users/{email}:
 *  put:
 *    tags:
 *      - User
 *    summary: Update a user.
 *    description: Update a user.
 *    parameters:
 *      - in: path
 *        name: email
 *        required: true
 *        description: The email of the user to update.
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UpdateUserInput'
 *    responses:
 *      200:
 *        description: The new user.
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
 *                  example: User updated successfully.
 *                data:
 *                  $ref: '#/components/schemas/UserResponse'
 *      403:
 *        $ref: '#/components/responses/PermissionDenied'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      422:
 *        $ref: '#/components/responses/ValidationError'
 *      500:
 *        $ref: '#/components/responses/ApplicationError'
 */
router.put(
  '/:email',
  [
    body('Name', 'Name is required').isLength({ min: 5 }).optional(),
    body('Password', 'Password is required').not().isEmpty().optional(),
  ],
  passport.authenticate('jwt', { session: false }),
  async function (req, res, next) {
    if (req.user.Email !== req.params.email) {
      return res.sendErrorResponse(
        'Permission denied',
        403, //
      );
    }

    // Check validation object for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.sendErrorResponse(
        errors.array(),
        422, // Unprocessable Content
      );
    }

    try {
      const filter = { Email: req.params.email };
      const options = { new: true };
      const update = {};

      // update name if exists
      if (req.body.Name) {
        update.Name = req.body.Name;
      }

      // update password if exists
      if (req.body.Password) {
        const hashedPassword = User.hashPassword(req.body.Password);
        update.Password = hashedPassword;
      }

      // update birthday if exists
      if (req.body.Birthday) {
        update.Birthday = req.body.Birthday;
      }

      const user = await User.findOneAndUpdate(filter, update, options);
      if (!user) {
        return res.sendErrorResponse(
          'No Found.',
          404, // Not Found
        );
      }

      return res.sendSuccessResponse(
        'User updated successfully.',
        {
          Email: user.Email,
          Name: user.Name,
          Birthday: user.Birthday,
        },
        200, // OK
      );
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /users/{email}:
 *  delete:
 *    summary: Delete a user from the system.
 *    tags:
 *      - User
 *    description: Delete a user from the system.
 *    parameters:
 *      - in: path
 *        name: email
 *        required: true
 *        description: The email of the user.
 *        schema:
 *          type: string
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: User was deleted.
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
 *                  example: User was deleted.
 *                data:
 *                  type: object
 *                  example: {}
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/PermissionDenied'
 *      500:
 *        $ref: '#/components/responses/ApplicationError'
 */
router.delete('/:email', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
  if (req.user.Email !== req.params.email) {
    return res.sendErrorResponse(
      'Permission denied',
      403, // Forbidden
    );
  }

  try {
    const { email } = req.params;
    await User.deleteOne({ Email: email });

    return res.sendSuccessResponse(
      'User was deleted',
      {},
      200, // OK
    );
  } catch (error) {
    next(error);
  }
});

module.exports = router;
