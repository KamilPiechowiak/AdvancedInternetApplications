const router = require("express").Router()
const organizerService = require("../services/organizer")
const tournamentsService = require("../services/tournaments")
const utils = require("./utils")

router.all("*", (req, res, next) => {
    if(!req.user) {
        req.session.redirectTo = req.url
        return res.redirect("/user/login")
    }
    next()
})

const showTournaments = (req, res, next, past) => {
    tournamentsService.getTournaments({
        page: req.params.page,
        past: past,
        organizerId: req.user.id
    }).then(tournaments => {
        res.render("organizer/list", {
            currentPage: req.params.page,
            url: utils.getUrlWithoutPageNumber(req),
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

router.post("tournaments/edit/:id", (req, res, next) => {
    organizerService.saveTournament(id, req.body, req.user)
        .then(tournament => {
            req.session.message = "savedSuccessfully"
            return res.redirect(`/organizer/tournaments/edit/${tournament.id}`)
        }).catch((err) => {
            if(err == "NotFound") {
                next()
            }
            res.render("organizer/edit", {
                message: undefined,
                data: req.body,
                validation: err
            })
        })
})

router.get("tournaments/edit/:id", (req, res) => {
    organizerService.getTournament(id, req.user)
        .then((data) => {
            res.render("organizer/edit", {
                message: utils.getMessage(req),
                data: data,
                validation: {}
            })
        }).catch((err) => {
            console.log(err)
            next()
        })
})

module.exports = router