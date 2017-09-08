const util = require('../middleware/utilities');
const config = require('../config');
const mongoose = require('mongoose');
const User = mongoose.model('user');

const index = (req, res) => {
  res.redirect('login');
};

const login = (req, res) => {
  res.locals.message = req.session.message;
  req.session.message = undefined;

  res.render('login');
};

const loginProcess = (req, res) => {
  util.auth(req.body.email, req.body.password, req.session, isAuth => {
    if (isAuth) {
      res.redirect('/chat');
    } else {
      req.session.message = 'Email o contraseña incorrecta';
      res.redirect(config.routes.login);
    }
  });
};

const signup = (req, res) => {
  res.locals.message = req.session.message;
  res.locals.fields = req.session.fields;
  req.session.message = undefined;
  req.session.fields = undefined;
  res.render('signup');
}

const signupProcess = (req, res) => {
  const newUser = {
    fullname: req.body.fullname,
    email: req.body.email,
    password: req.body.password
  };

  if (req.session.message) {
    res.redirect('signup');
    return;
  }

  (new User(newUser)).save();
  res.redirect('login');
}

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
module.exports.signup = signup;
module.exports.signupProcess = signupProcess;
module.exports.chat = chat;
module.exports.logOut = logOut
