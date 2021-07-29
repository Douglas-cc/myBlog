const Sequelize = require('sequelize')

const connection = new Sequelize('myblog', 'root', 'jedi1290', {
  host: 'localhost',
  dialect: 'mysql',
  timezone: '-03:00'
})

module.exports = connection
