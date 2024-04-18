const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *  schemas:
 *    MovieResponse:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *          example: 66023134a0c60162df946906
 *        Title:
 *          type: string
 *          example: The Dark Knight
 *        Description:
 *          type: string
 *          example: When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one...
 *        ImagePath:
 *          type: string
 *          example: poster.jpg
 *        Featured:
 *          type: boolean
 *          example: true
 *        ReleaseYear:
 *          type: integer
 *          example: 2008
 *        MPA:
 *          type: string
 *          description: The Motion Picture Association rating.
 *          example: 2008
 *        IMDb:
 *          type: integer
 *          description: The IMDb ratings.
 *          example: 9
 *        Genre:
 *          $ref: '#/components/schemas/GenreResponse'
 *        Director:
 *          $ref: '#/components/schemas/DirectorResponse'
 *        Actors:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Actor'
 *    DirectorResponse:
 *      type: object
 *      properties:
 *        Name:
 *          type: string
 *          example: Christopher Nolan
 *        Bio:
 *          type: string
 *          example: Christopher Nolan is a British-American film director, producer, and screenwriter. He is...
 *        Birth:
 *          type: string
 *          nullable: true
 *          format: date
 *          example: 1970-01-01T00:00:01.970Z
 *        Death:
 *          type: string
 *          nullable: true
 *          format: date
 *          example: null
 *    GenreResponse:
 *      type: object
 *      properties:
 *        Name:
 *          type: string
 *          example: Action
 *        Description:
 *          type: string
 *          example: Action film
 */
const movieSchema = mongoose.Schema(
  {
    Title: { type: String, required: true },
    Description: { type: String, required: true },
    Genre: {
      Name: String,
      Description: String,
    },
    Director: {
      Name: String,
      Bio: String,
      Birth: Date,
      Death: Date,
    },
    ImagePath: { type: String, required: true },
    Featured: Boolean,
    ReleaseYear: Number,
    Actors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actor' }],
    MPA: { type: String, required: true },
    IMDb: Number,
  },
  {
    timestamps: { createdAt: 'CreatedAt', updatedAt: 'UpdatedAt' },
  },
);

module.exports = mongoose.model('Movie', movieSchema);
