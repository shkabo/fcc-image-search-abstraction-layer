const express = require('express');
const app = express();
const config = require('./config/config');
const port = process.env.PORT || 3000;

app.use(require('./routes'));

const server = app.listen(port, () => {
  console.log('App is up and running @ port: ' + port);  
});

module.exports = server;
