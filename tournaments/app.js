const express = require("express")
const session = require("express-session")
const app = express()
const bodyParser = require("body-parser")
const config = require("./config")
// const passport = require("./services/user/passport")
const router = require("./routes")
const { sequelize } = require("./models")


app.set("view engine", "ejs")

app.use(session(config.session))

app.use(bodyParser.urlencoded({ extended: false }))

// app.use(passport.initialize())
// app.use(passport.session())

app.use(express.static("public"))

app.use("/", router)

sequelize.sync().then(() => {
    app.listen(config.port, () => {
        console.log(`Server running at http://localhost:${config.port}`)
    })
})