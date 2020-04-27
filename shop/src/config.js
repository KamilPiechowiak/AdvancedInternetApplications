const config = {}

config.port = 3001
config.db = {
    host: "localhost",
    port: 5432,
    database: "shop",
    user: "shop",
    password: "pokemon"
}
config.session = {
    secret: "1PI2Ft9UcZkRfv6HuIV8",
    resave: false,
    saveUninitialized: true
}

module.exports = config