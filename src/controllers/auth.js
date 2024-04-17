const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const jwtSecret = 'your_jwt_secret'; // This has to be the same key used in the JWTStrategy

require('../utils/passport'); // Your local passport file

const generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Email, // This is the username you’re encoding in the JWT
    expiresIn: '7d', // This specifies that the token will expire in 7 days
    algorithm: 'HS256', // This is the algorithm used to “sign” or encode the values of the JWT
  });
};

/**
 * @swagger
 * /login:
 *  post:
 *    tags:
 *      - Auth
 *    summary: Create an auth token.
 *    description: Create an auth token.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/LoginUserInput'
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
 *                  example: You are successfully logged in.
 *                data:
 *                  type: object
 *                  properties:
 *                    user:
 *                      $ref: '#/components/schemas/UserResponse'
 *                    token:
 *                      type: string
 *                      example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *      400:
 *        description: Incorrect email or password.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: false
 *                error:
 *                  type: object
 *                  properties:
 *                    code:
 *                      type: integer
 *                      example: 400
 *                    message:
 *                      type: string
 *                      example: Incorrect email or password.
 *      500:
 *        $ref: '#/components/responses/ApplicationError'
 */
router.post('/login', (req, res) => {
  passport.authenticate('local', { session: false }, (error, user, info) => {
    if (error || !user) {
      return res.sendErrorResponse(info.message, 400);
    }

    req.login(user, { session: false }, (error) => {
      if (error) {
        res.sendErrorResponse(error);
      }

      const token = generateJWTToken(user.toJSON());
      return res.sendSuccessResponse('You are successfully logged in', { user, token }, 200);
    });
  })(req, res);
});

module.exports = router;
