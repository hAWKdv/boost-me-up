'use strict';

const connect = require('connect');
const serveStatic = require('serve-static');
const PORT = 8080;

connect()
.use(serveStatic('./'))
.listen(PORT, () => {
  console.log(`Server running on ${PORT}...`);
});
