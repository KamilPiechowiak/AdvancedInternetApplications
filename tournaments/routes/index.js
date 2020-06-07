const express = require("express")
const router = express.Router()
const userRouter = require("./user")
const loginService = require("../services/user/loginService")
const utils = require("./utils")

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

router.use("/user", userRouter)

router.get("/", (req, res) => {
    res.render("index", {
        message: utils.getMessage(req)
    })
})

module.exports = router