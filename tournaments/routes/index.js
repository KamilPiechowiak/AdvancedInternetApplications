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
    console.log(req.session.userid)
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
    res.sendStatus(404)
})

// router.get("/", (req, res, next) => {
//     tournamentsService.getTournaments({
//         page: 1
//     }).then(tournaments => {
//         res.render("index", {
//             message: utils.getMessage(req),
//             ...tournaments
//         })
//     }).catch(err => {
//         console.log(err)
//         next()
//     })
// })

module.exports = router