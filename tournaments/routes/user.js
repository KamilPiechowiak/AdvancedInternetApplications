const router = require("express").Router()
const utils = require("./utils")
const loginService = require("../services/user/loginService")
const registrationService = require("../services/user/registrationService")
const forgotPasswordService = require("../services/user/forgotPasswordService")
const messages = require("../strings/messages")

router.post("/login", (req, res) => {
    loginService.login(req.body).then(user => {
        req.session.userid = loginService.serializeUser(user)
        res.redirect(utils.redirectTo(req, "/"))
    }).catch(err => {
        return res.render("user/login", {
            message: messages[err]
        })
    })
})

router.get("/login", (req, res) => {
    if(!req.user) {
        res.render("user/login", {
            message: utils.getMessage(req)
        })
    } else {
        req.session.message = "alreadyLoggedIn"
        res.redirect("/")
    }
})

router.get("/logout", (req, res) => {
    req.session.userid = null
    req.session.message = "loggedOut"
    res.redirect("/")
})

router.post("/signup", (req, res) => {
    registrationService.register(req.body).then(() => {
        console.log("success")
        req.session.message = "accountCreated"
        res.redirect("/")
    }).catch(err => {
        console.log(err)
        res.render("user/signup", {
            message: err.general ? messages[err.general] : undefined,
            data: req.body,
            validation: err
        })
    })
})

router.get("/signup", (req, res) => {
    res.render("user/signup", {
        message: undefined,
        data: {},
        validation: {}
    })
})

router.get("/activate/:token", async (req, res) => {
    const message = await registrationService.activate(req.params.token)
    res.render("user/activate", {
        message: messages[message]
    })
})

router.post("/forgotpassword", async (req, res) => {
    forgotPasswordService.forgotPassword(req.body.email).then(() => {
        req.session.message = "resetPasswordEmailSent"
        res.redirect("/")
    }).catch(err => {
        console.log(err)
        res.render("user/forgotpassword", {
            message: messages[err],
            data: req.body
        })
    })
})

router.get("/forgotpassword", (req, res) => {
    res.render("user/forgotpassword", {
        message: undefined,
        data: {}
    })
})

router.post("/resetpassword/:token", (req, res) => {
    forgotPasswordService.resetPassword(req.body, req.params.token).then(() => {
        req.session.message = "passwordResetSuccess"
        res.redirect("/user/login")
    }).catch(err => {
        console.log(err)
        res.render("user/resetpassword", {
            message: err.general ? messages[err.general] : undefined,
            validation: err
        })
    })
})

router.get("/resetpassword/:token", async (req, res, next) => {
    const ok = await forgotPasswordService.checkIfResetTokenExists(req.params.token)
    if(!ok) {
        next()
    }
    res.render("user/resetpassword", {
        message: undefined,
    })
})

module.exports = router