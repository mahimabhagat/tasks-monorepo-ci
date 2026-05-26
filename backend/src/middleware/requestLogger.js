const morgan = require('morgan');

// Use Morgan for request logging, customizing the format based on env
const requestLogger = morgan('dev');

module.exports = { requestLogger };
