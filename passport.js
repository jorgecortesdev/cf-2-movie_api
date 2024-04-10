const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./models.js'),
  passportJWT = require('passport-jwt');

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'Email',
      passwordField: 'Password',
    },
    async (email, password, callback) => {
      console.log(`${email} ${password}`);
      await Users
        .findOne({ Email: email })
        .select(['-_id', '-CreatedAt', '-UpdatedAt'])
        .then((user) => {
          if (!user) {
            console.log('incorrect email');
            return callback(null, false, {
              message: 'Incorrect email or password.',
            });
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
  console.log(jwtPayload)
  return await Users
    .findOne({ Email: jwtPayload.Email })
    .select(['-_id', '-CreatedAt', '-UpdatedAt'])
    .then((user) => {
      return callback(null, user);
    })
    .catch((error) => {
      return callback(error)
    });
}));
