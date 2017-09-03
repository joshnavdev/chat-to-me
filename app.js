const express = require('express');
const app =  express();
const routes = require('./routes');
const erroHandlers = require('./middleware/errorhandlers');
const log = require('./middleware/log');

app.use(log.logger);

app.get('/', routes.index);
app.get('/login', routes.login);
app.post('/login', routes.loginProcess);
app.get('/chat', routes.chat);
app.get('/error', (req, res, next) => {
  next(new Error('A contrived error'))
});

app.use(erroHandlers.error);
app.use(erroHandlers.notFound);

app.listen(3000);
console.log('App server running on port 3000');
