const cors = require('cors');

let allowedOrigins = [
  'http://localhost:8080'
];

function startCors(app) {
  app.use(cors({
    origin: (origin, callback) => {
      if(!origin) return callback(null, true);
      if(allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn't found on the list of allowed origins
        let message = `The CORS policy for this application doesn't allow access from origin ${origin}`;
        return callback(new Error(message ), false);
      }
      return callback(null, true);
    }
  }));
}

module.exports = startCors;
