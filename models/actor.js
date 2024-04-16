const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *  schemas:
 *    Actor:
 *      type: object
 *      properties:
 *        Name:
 *          type: string
 *          description: The name of the actor.
 *        Bio:
 *          type: string
 *          description: The bio of the actor.
 *        Birthday:
 *          type: string
 *          format: date
 *          description: The birthday of the actor.
 *        ImagePath:
 *          type: string
 *          description: The full URL of the movie poster.
 *      example:
 *        Name: Christian Bale
 *        Bio: Christian Charles Philip Bale was born in Pembrokeshire, Wales, UK on January 30, 1974, to English parents Jennifer...
 *        Birthday: 1974-01-30T00:00:00.000Z
 *        ImagePath: profile.jpg
 */
let actorSchema = mongoose.Schema({
  Name: { type: String, required: true },
  Bio: { type: String, required: true },
  Birthday: Date,
  ImagePath: { type: String, required: true },
}, {
  timestamps: { createdAt: 'CreatedAt', updatedAt: 'UpdatedAt' }
});

module.exports = mongoose.model('Actor', actorSchema);
