const express = require('express');
const app =  express();
const routes = require('./routes');
const erroHandlers = require('./middleware/errorhandlers');
const log = require('./middleware/log');
const partials = require('express-partials');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const bodyParser = require('body-parser');
const csrf = require('csurf');
const util = require('./middleware/utilities');
const flash = require('connect-flash');
const config = require('./config');

app.set('view engine', 'ejs');
app.set('view options', { defaultLayout: 'layout' });
app.use(partials());
app.use(log.logger);
app.use(express.static(__dirname + '/static'));
app.use(cookieParser(config.secret));
app.use(session({
  secret: config.secret,
  saveUninitialized: true,
  resave: true,
  store: new RedisStore({ url: config.redisUrl })
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(csrf());
app.use(util.csrf);
app.use(util.authenticated);
app.use(flash());
app.use(util.templateRoutes);

app.get('/', routes.index);
app.get(config.routes.login, routes.login);
app.post(config.routes.login, routes.loginProcess);
app.get('/chat', [util.requireAuthentication], routes.chat);
app.get(config.routes.logout, routes.logOut);
app.get('/error', (req, res, next) => {
  next(new Error('A contrived error'))
});

app.use(erroHandlers.error);
app.use(erroHandlers.notFound);

app.listen(config.port);
console.log('App server running on port 3000');

