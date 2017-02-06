'use strict';

const connect = require('connect');
const serveStatic = require('serve-static');
const PORT = 8080;
const PATH = './public';

connect()
.use(serveStatic(PATH))
.listen(PORT, () => {
  console.log('Server running on 8080...');
});
