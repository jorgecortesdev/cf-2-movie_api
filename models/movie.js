const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String
  },
  Director: {
    Name: String,
    Bio: String,
    Birth: Date,
    Death: Date
  },
  ImagePath: { type: String, required: true },
  Featured: Boolean,
  ReleaseYear: Number,
  Actors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actor' }],
  MPA: { type: String, required: true },
  IMDb: Number
}, {
  timestamps: { createdAt: 'CreatedAt', updatedAt: 'UpdatedAt' }
});

module.exports = mongoose.model('Movie', movieSchema);
