const express = require("express")
const session = require("express-session")
const app = express()
const bodyParser = require("body-parser")
const config = require("./config")
const router = require("./routes")
const { sequelize } = require("./models")
const tournamentsSeedingService = require("./services/tournaments/seedingService")

app.set("view engine", "ejs")

app.use(session(config.session))

app.use(bodyParser.urlencoded({ extended: false }))

tournamentsSeedingService.start()

app.use(express.static("public"))

app.use("/", router)

sequelize.sync().then(() => {
    app.listen(config.port, () => {
        console.log(`Server running at http://localhost:${config.port}`)
    })
})