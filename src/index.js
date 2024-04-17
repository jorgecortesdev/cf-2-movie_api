const express = require('express');
const logger = require('morgan');
const path = require('path');
const startCors = require('./utils/cors');
const connect = require('./utils/connect');
const swagger = require('./utils/swagger');
const routes = require('../routes/api');

require('dotenv').config();

const app = express();

startCors(app);

app.use(logger('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(require('./utils/responses'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  return res.sendErrorResponse('Something broke!', 500);
});

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, async () => {
  console.log(`Your app is listening aon port ${port}`);

  await connect();

  routes(app);

  swagger(app, port);
});
