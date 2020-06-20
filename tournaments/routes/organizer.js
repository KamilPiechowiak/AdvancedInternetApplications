const router = require("express").Router()
const organizerService = require("../services/organizer")
const tournamentsService = require("../services/tournaments")
const utils = require("./utils")

router.all("*", (req, res, next) => {
    if(!req.user) {
        req.session.redirectTo = req.originalUrl
        return res.redirect("/user/login")
    }
    next()
})

const showTournaments = (req, res, next, past) => {
    tournamentsService.getTournaments({
        page: req.params.page,
        past: past,
        organizerId: req.user.id,
        search: req.params.search
    }).then(tournaments => {
        const title = past ? "Past tournaments organized" : "Upcoming tournaments organized"
        res.render("tournaments/list", {
            title: title,
            message: utils.getMessage(req),
            currentPage: req.params.page,
            url: utils.getUrlWithoutPageNumber(req),
            owner: true,
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

router.post("/tournaments/edit/:id", (req, res, next) => {
    organizerService.saveTournament(req.params.id, req.body, req.user)
        .then(tournament => {
            req.session.message = "savedSuccessfully"
            return res.redirect(`/organizer/tournaments/edit/${tournament.id}`)
        }).catch((err) => {
            if(err == "NotFound") {
                next()
            }
            res.render("organizer/edit", {
                id: req.params.id,
                message: undefined,
                data: req.body,
                validation: err
            })
        })
})

router.get("/tournaments/edit/:id", (req, res, next) => {
    organizerService.getTournament(req.params.id, req.user)
        .then((data) => {
            res.render("organizer/edit", {
                id: req.params.id,
                message: utils.getMessage(req),
                data: data,
                validation: {}
            })
        }).catch((err) => {
            console.log(err)
            next()
        })
})

router.get("/tournaments/delete/:id", (req, res, next) => {
    organizerService.deleteTournament(req.params.id, req.user).then(()=>{
        req.session.message = "tournamentDeleted"
        res.sendStatus(204)
    }).catch(err => {
        console.log(err)
        next()
    })
})

module.exports = router