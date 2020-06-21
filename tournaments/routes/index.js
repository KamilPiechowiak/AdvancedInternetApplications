const express = require("express")
const router = express.Router()
const userRouter = require("./user")
const tournamentsRouter = require("./tournaments")
const playerRouter = require("./player")
const organizerRouter = require("./organizer")
const loginService = require("../services/user/loginService")
const utils = require("./utils")
const tournamentsService = require("../services/tournaments")

router.all("*", async (req, res, next) => {
    if(req.session.userid) {
        req.user = await loginService.deserializeUser(req.session.userid)
        res.locals.user = req.user
        next()
    } else {
        res.locals.user = null
        next()
    }
})

router.get("/", (req, res, next) => {
    req.url="/tournaments/1"+req.url.substring(1)
    req.originalUrl="tournaments/1"+req.originalUrl.substring(1)
    next()
})

router.use("/user", userRouter)
router.use("/tournaments", tournamentsRouter)
router.use("/player", playerRouter)
router.use("/organizer", organizerRouter)

router.all("*", (req, res) => {
    res.status(404)
    res.render("err")
})

module.exports = router