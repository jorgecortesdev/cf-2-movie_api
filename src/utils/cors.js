const cors = require('cors');

const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:1234',
  'https://cf-myflix-react-client.netlify.app',
  'https://cf-myflix-react.jorgecortes.dev',
];

function startCors(app) {
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
          // If a specific origin isn't found on the list of allowed origins
          const message = `The CORS policy for this application doesn't allow access from origin ${origin}`;
          return callback(new Error(message), false);
        }
        return callback(null, true);
      },
    }),
  );
}

module.exports = startCors;
