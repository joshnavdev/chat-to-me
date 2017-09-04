const util = require('../middleware/utilities');
const config = require('../config');

const index = (req, res) => {
  res.render('index', {
    title: 'Index'
  });
};

const login = (req, res) => {
  res.render('login', { title: 'Login', message: req.flash('error') });
};

const loginProcess = (req, res) => {
  const isAuth = util.auth(req.body.username, req.body.password, req.session);
  if (isAuth) {
    res.redirect('/chat');
  } else {
    req.flash('error', 'Wrong username or password');
    res.redirect(config.routes.login);
  }
};

const chat = (req, res) => {
  res.render('chat', { title: 'Chat' });
}

const logOut = (req, res) => {
  util.logOut(req.session);
  res.redirect('/');
};

module.exports.index = index;
module.exports.login = login;
module.exports.loginProcess = loginProcess;
module.exports.chat = chat;
module.exports.logOut = logOut
