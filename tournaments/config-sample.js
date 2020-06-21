'use strict'
const config = {}

config.port = 3001
config.db = "postgres://user:password@localhost:5432/database"
config.session = {
    secret: "secret",
    resave: false,
    saveUninitialized: false
}
config.nodemailer = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'user',
        pass: 'password'
    }
}
config.url = `http://localhost:${config.port}`

module.exports = config