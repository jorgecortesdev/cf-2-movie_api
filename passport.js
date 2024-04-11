const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  User = require('./models/user'),
  passportJWT = require('passport-jwt');

let JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'Email',
      passwordField: 'Password',
    },
    async (email, password, callback) => {
      console.log(`${email} ${password}`);
      await User
        .findOne({ Email: email })
        .select(['-_id', '-CreatedAt', '-UpdatedAt'])
        .then((user) => {
          if (!user) {
            console.log('incorrect email');
            return callback(null, false, {
              message: 'Incorrect email or password.',
            });
          }
          if (!user.validatePassword(password)) {
            console.log('incorrect password');
            return callback(null, false, { message: 'Incorrect password.' });
          }
          console.log('finished');
          return callback(null, user);
        })
        .catch((error) => {
          if (error) {
            console.log(error);
            return callback(error);
          }
        });
    }
  )
);


passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret'
}, async (jwtPayload, callback) => {
  return await User
    .findOne({ Email: jwtPayload.Email })
    .select(['-_id', '-CreatedAt', '-UpdatedAt'])
    .then((user) => {
      return callback(null, user);
    })
    .catch((error) => {
      return callback(error)
    });
}));
