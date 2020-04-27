const express = require("express")
const router = express.Router()
const storage = require("./storage")
const logic = require("./logic")

router.use((req, res, next) => {
    if(req.session.basket == undefined) {
        req.session.basket = []
    }
    next()
})

router.post("/addProduct", (req, res) => {
    const id = parseInt(req.body.id)
    let added = false
    for(let i=0; i < req.session.basket.length; i++) {
        if(req.session.basket[i].id == id) {
            req.session.basket[i].quantity++
            added = true
            break
        }
    }
    if(!added) {
        req.session.basket.push({
            id: id,
            quantity: 1
        })
    }
    res.redirect("/?status=added")
})

router.post("/removeProduct", (req, res) => {
    const id = parseInt(req.body.id)
    for(let i=0; i < req.session.basket.length; i++) {
        if(req.session.basket[i].id == id) {
            req.session.basket.splice(i, 1)
        }
    }
    res.redirect("/basket")
})

router.all("/finalizeTransaction", async (req, res) => {
    const notAvailable = await storage.tryOrderingProducts(req.session.basket)
    if(notAvailable.length == 0) {
        req.session.basket = []
        res.redirect("/?status=success")
    } else {
        req.session.notAvailable = notAvailable
        res.redirect("/basket")
    }
})

router.all("/cancelTransaction", (req, res) => {
    req.session.basket = []
    res.redirect("/?status=cancelled")
})

router.all("/", async (req, res) => {
    res.render("index", {
        products: await storage.getAllProducts(),
        message: logic.stateMessages[req.query.status]
    })
})

router.all("/basket", async (req, res) => {
    const notAvailable = req.session.notAvailable
    req.session.notAvailable = []
    res.render("basket", {
        products: await storage.getProducts(
            req.session.basket.map(product => product.id),
            req.session.basket.map(product => product.quantity)
        ),
        notAvailable: await storage.getProducts(notAvailable)
    })
})

router.get("*", (req, res) => {
    res.status(404)
    res.render("404")
})

module.exports = router