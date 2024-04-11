const mongoose = require('mongoose'),
  bcrypt = require('bcrypt');

let userSchema = mongoose.Schema({
  Email: { type: String, required: true },
  Name: { type: String, required: true },
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
