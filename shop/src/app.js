const express = require("express")
const app = express()
const router = require("./router")
const session = require("express-session")
const config = require("./config")
const bodyParser = require("body-parser")

app.set("view engine", "ejs")

app.use(session(config.session))

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static("public"))

app.use("/", router)

app.listen(config.port, () => {
    console.log(`Server running at http://localhost:${config.port}`)
})