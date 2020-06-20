const router = require("express").Router()
const tournamentsService = require("../services/tournaments")
const utils = require("./utils")

const showTournaments = (req, res, next, past) => {
    console.log(req.query.search)
    tournamentsService.getTournaments({
        page: req.params.page,
        past: past,
        search: req.query.search
    }).then(tournaments => {
        const title = past ? "Past tournaments" : "Tournaments"
        res.render("tournaments/list", {
            title: title,
            message: utils.getMessage(req),
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

router.get("/:page", (req, res, next) => {
    showTournaments(req, res, next, false)
})

router.get("/past/:page", (req, res, next) => {
    showTournaments(req, res, next, true)
})

router.get("/details/:id", (req, res, next) => {
    let userid = null
    if(req.user && req.user.id) {
        userid = req.user.id
    }
    tournamentsService.getSingle(req.params.id, userid).then(tournament => {
        res.render("tournaments/single", {
            message: utils.getMessage(req),
            tournament: tournament
        })
    }).catch(err => {
        console.log(err)
        next()
    })
})

router.get("/matches/:id", async (req, res) => {
    res.json(await tournamentsService.getMatches(req.params.id))
})

module.exports = router