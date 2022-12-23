const Sequelize = require('sequelize');

const storage = process.env.NODE_ENV === 'test' ? ':memory:' : './database.sqlite3';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage,
});

module.exports = sequelize;