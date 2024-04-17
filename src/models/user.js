const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * @swagger
 * components:
 *  schemas:
 *    LoginUserInput:
 *      type: object
 *      required:
 *        - Email
 *        - Password
 *      properties:
 *        Email:
 *          type: string
 *          example: jorge@test.com
 *        Password:
 *          type: string
 *          example: password
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - Name
 *        - Email
 *        - Password
 *      properties:
 *        Name:
 *          type: string
 *          example: Jorge Cortés
 *        Email:
 *          type: string
 *          example: jorge@test.com
 *        Password:
 *          type: string
 *          example: password
 *        Birthday:
 *          type: string
 *          format: date
 *          example: 1979-08-11
 *    UpdateUserInput:
 *      type: object
 *      properties:
 *        Name:
 *          type: string
 *          example: Jorge Cortés
 *        Password:
 *          type: string
 *          example: password
 *        Birthday:
 *          type: string
 *          format: date
 *          example: 1979-08-11
 *    UserResponse:
 *      type: object
 *      properties:
 *        Name:
 *          type: string
 *          example: Jorge Cortés
 *        Email:
 *          type: string
 *          example: jorge@test.com
 *        Birthday:
 *          type: string
 *          format: date
 *          example: 1979-08-11
 *        FavoriteMovies:
 *          type: array
 *        ToWatch:
 *          type: array
 *  responses:
 *    UserExists:
 *      description: User already exists.
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              success:
 *                type: boolean
 *                example: false
 *              error:
 *                type: object
 *                properties:
 *                  code:
 *                    type: integer
 *                    example: 400
 *                  message:
 *                    type: string
 *                    example: User already exists.
 */
let userSchema = mongoose.Schema({
  Name: { type: String, required: true },
  Email: { type: String, required: true },
  Password: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  ToWatch: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
}, {
  timestamps: { createdAt: 'CreatedAt', updatedAt: 'UpdatedAt' }
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password);
};

module.exports = mongoose.model('User', userSchema);
