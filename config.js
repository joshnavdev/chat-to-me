var config = {
  port: 4000,
  secret: 'secret',
  redisUrl: 'redis://localhost',
  mongoUrl: 'mongodb://localhost:47017/chattome',
  routes: {
    login: '/login',
    logout: '/logout'
  }
};

module.exports = config;
