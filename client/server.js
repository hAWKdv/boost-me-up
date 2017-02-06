'use strict';

const connect = require('connect');
const serveStatic = require('serve-static');

connect().use(serveStatic('./public')).listen(8080, function() {
  console.log('Server running on 8080...');
});
