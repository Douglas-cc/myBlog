const Sequelize = require('sequelize')
// const dotenv = require('dotenv')

// dotenv.config()

// database = process.env.MYSQL_DATABASE
// user = process.env.MYSQL_USER
// host = process.env.MYSQL_HOST
// port = process.env.MYSQL_LOCAL_PORT
// password = process.env.MYSQL_ROOT_PASSWORD

const connection = new Sequelize(
  'db-blog', 
  'root',
  'jedi1290', {
    host: 'db',
    port: 3306,
    dialect: 'mysql',
    timezone: '-03:00',
})

connection.sync({});

module.exports = connection
