const router = require("express").Router()
const tournamentsService = require("../services/player/tournamenstsService")
const matchesService = require("../services/player/matchesService")
const utils = require("./utils")
const messages = require("../strings/messages")

router.all("*", (req, res, next) => {
    if(!req.user) {
        req.session.redirectTo = req.originalUrl
        return res.redirect("/user/login")
    }
    next()
})

router.post("/register/:id", async (req, res) => {
    tournamentsService.registerForTournament(req.params.id, req.body, req.user).then(msg=>{
        req.session.message = msg
        return res.redirect(`/tournaments/details/${req.params.id}`)
    }).catch(err => {
        res.render("player/register", {
            message: err.general ? messages[err.general] : undefined,
            data: req.body,
            validation: err
        })
    })
})

router.get("/register/:id", (req, res) => {
    tournamentsService.checkIfItIsPossibleToRegister(req.params.id, req.user)
        .then(()=>{
            res.render("player/register", {
                message: undefined,
                data: {},
                validation: {}
            })
        }).catch(err => {
            req.session.message = err
            return res.redirect(`/tournaments/details/${req.params.id}`)
        })
})

const showTournaments = (req, res, next, past) => {
    tournamentsService.getTournaments({
        userId: req.user.id,
        page: req.params.page,
        past: past,
        search: req.query.search
    }).then(tournaments => {
        res.render("tournaments/list", {
            currentPage: req.params.page,
            url: utils.getUrlWithoutPageNumber(req),
            search: req.query.search,
            ...tournaments
        })
    }).catch(err => {
        console.log(err)
        next()
    })
}

router.get("/tournaments/:page", (req, res, next) => {
    showTournaments(req, res, next, false)
})

router.get("/tournaments/past/:page", (req, res, next) => {
    showTournaments(req, res, next, true)
})

const showMatches = (req, res, next, past) => {
    matchesService.getMatches({
        userId: req.user.id,
        page: req.params.page,
        past: past,
        search: req.params.search
    }).then(matches => {
        res.render("player/matches", {
            url: utils.getUrlWithoutPageNumber(req),
            userId: req.user.id,
            ...matches
        })
    }).catch(err => {
        console.log(err)
        next()
    })
}

router.get("/matches/:page", (req, res, next) => {
    showMatches(req, res, next, false)
})

router.get("/matches/past/:page", (req, res, next) => {
    showMatches(req, res, next, true)
})

router.post("/matches/:page", async (req, res, next) => {
    matchesService.updateMatch(req.body.id, req.user.id, parseInt(req.body.verdict)).then(()=> {
        return res.redirect(req.url)
    }).catch(err => {
        console.log(err)
        next()
    })
})

module.exports = router