const config = require('../config');
const mongoose = require('mongoose');
const User = mongoose.model('user');

module.exports.csrf = (req, res, next) => {
  res.locals.token = req.csrfToken();
  next();
};

module.exports.authenticated = (req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated;
  if (req.session.isAuthenticated) {
    res.locals.user = req.session.user;
  }
  next();
};

module.exports.requireAuthentication = (req, res, next) => {
  console.log('isAuthenticated ->', req.session.isAuthenticated)
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect(config.routes.login);
  }
};

module.exports.logOut = (session) => {
  session.isAuthenticated = false;
  delete session.user;
};

module.exports.auth = (email, password, session, cb) => {
  User.findOne({ email, password }, (err, user) => {
    if (err) {
      cb(false);
      return;
    }

    if(!user) {
      cb(false);
      return;
    }

    if (user) {
      console.log('User ->', user);
      const { fullname, email } = user;
      session.isAuthenticated = true;
      session.user = { fullname, email };
    }
    cb(true);
  });
};

module.exports.templateRoutes = (req, res, next) => {
  res.locals.routes = config.routes;
  next();
};

module.exports.validateEmail = (req, res, next) => {
  const newUser = {
    fullname: req.body.fullname,
    email: req.body.email,
    password: req.body.password
  };
  User.findOne({ email: newUser.email }, (err, user) => {
    if (err) {
      res.status(500).json({ message: 'Something broke' });
      return;
    }

    if (user) {
      req.session.message = 'El correo ya se encuentra en uso';
      req.session.fields = newUser;
      next();
      return;
    }
    console.log('asdasd')
    next();
  })
}
// module.exports.showOnce = (req, res, next) => {
//   if (!req.session.showOnce) {
//     req.session.errors = null;
//     req.session.dataTemp = null;
//   } else {
//     req.session.showOnce = false;
//   }
//   next();
// }

// module.exports.validate = (req, res, next) => {
//   req.checkBody({
//     fullname: {
//       notEmpty: {
//         errorMessage: 'Full name is empty'
//       }
//     },
//     email: {
//       notEmpty: {
//         errorMessage: 'Email is empty'
//       }
//     },
//     password: {
//       notEmpty: {
//         errorMessage: 'Password is empty'
//       }
//     }
//   });
//   next();
// }

// module.exports.validatedFields = (req, res, next) => {
//   res.locals.hasEmptyFields = req.session.hasEmptyFields;
//   next();
// };

// module.exports.validate = (object, session) => {
//   let hasEmptyFields = false;
//   for (const key in object) {
//     if(object[key] === '') {
//       hasEmptyFields = true;
//       break;
//     }
//   }

//   if (hasEmptyFields) {
//     session.hasEmptyFields = hasEmptyFields;
//   } else {
//     session.hasEmptyFields = false;
//   }

//   return hasEmptyFields;
// }
