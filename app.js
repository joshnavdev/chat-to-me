
const models = require('./models');
const mongoose = require('mongoose');

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
const expressValidator = require('express-validator');
// CONECTING TO MONGO
// const models = require('./models');
// const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUrl, { useMongoClient: true });
mongoose.connection
  .once('open', () => console.log('Connecte to MongoDB'))
  .on('error', error => console.log('Error connecting to MongoDB', error));

// ==============================
app.set('view engine', 'jade');
// app.set('view options', { layout: false });
app.use(partials());
app.use(log.logger);
app.use(express.static(__dirname + '/static'));
app.use(expressValidator());
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
// app.use(util.validatedFields);

app.get('/', routes.index);
app.get(config.routes.login, routes.login);
app.post(config.routes.login, routes.loginProcess);
app.get('/signup', routes.signup);
app.post('/signup', [util.validateEmail], routes.signupProcess);
app.get('/chat', [util.requireAuthentication], routes.chat);
app.get(config.routes.logout, routes.logOut);
app.get('/error', (req, res, next) => {
  next(new Error('A contrived error'))
});

app.use(erroHandlers.error);
app.use(erroHandlers.notFound);

app.listen(config.port);
console.log(`App server running on port ${config.port}`);

