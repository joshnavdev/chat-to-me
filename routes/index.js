const index = (req, res) => {
  res.render('index', {
    title: 'Index'
  });
};

const login = (req, res) => {
  res.render('login', { title: 'Login' });
};

const loginProcess = (req, res) => {
  console.log(req.body);
  res.send(req.body.username + ' ' + req.body.password);
};

const chat = (req, res) => {
  res.render('chat', { title: 'Chat' });
}

module.exports.index = index;
module.exports.login = login;
module.exports.loginProcess = loginProcess;
module.exports.chat = chat;
