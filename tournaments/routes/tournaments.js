const router = require("express").Router()
const tournamentsService = require("../services/tournaments")
const utils = require("./utils")

const showTournaments = (req, res, next, past) => {
    tournamentsService.getTournaments({
        page: req.params.page,
        past: past,
        search: req.params.search
    }).then(tournaments => {
        res.render("tournaments/list", {
            currentPage: req.params.page,
            url: utils.getUrlWithoutPageNumber(req),
            ...tournaments
        })
    }).catch(err => {
        console.log(err)
        next()
    })
}

router.get("/:page", (req, res, next) => {
    showTournaments(req, res, next, false)
})

router.get("/past/:page", (req, res, next) => {
    showTournaments(req, res, next, true)
})

router.get("/search/:search/:page", (req, res, next) => {
    showTournaments(req, res, next, false)
})

router.get("/past/search/:search/:page", (req, res, next) => {
    showTournaments(req, res, next, true)
})

router.get("/details/:id", (req, res, next) => {
    const userid = undefined
    if(req.user && req.user.id) {
        userid = req.user.id
    }
    tournamentsService.getSingle(id, userid).then(tournament => {
        tournament.message = utils.getMessage(req)
        res.render("tournaments/single", tournament)
    }).catch(err => {
        console.log(err)
        next()
    })
})

module.exports = router