const env = require('sugar-env');
require('dotenv').config();

const port = process.env.PORT || 3000;

module.exports = {
  port: env.get(['GRAPHQL_PORT', 'API_PORT'], port),
  host: env.get(['GRAPHQL_HOST', 'API_HOST'], '0.0.0.0')
};
