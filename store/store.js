"use strict"
const request = require("superagent")
// const fsPromises = require("fs").promises
const JSDOM = require("jsdom").JSDOM

class Cable {
    constructor(product) {
        this.name = product.getElementsByClassName("sc-1yu46qn-12")[0].textContent
        let length = product.getElementsByClassName("vb9gxz-0")[0].lastChild.textContent
        this.length = parseFloat(length.split(" ")[1].replace(",", "."))
        let price = product.getElementsByClassName("sc-6n68ef-0")[0].textContent
        this.price = parseFloat(price.split(" ")[0].replace(",", "."))
        this.unitPrice = this.price/this.length
    }
}
request.get("https://www.x-kom.pl/g-12/c/1712-kable-sieciowe-rj-45-lan.html")
    .then(function(res) {
        // fsPromises.writeFile("index.html", res.text)
        const document = new JSDOM(res.text).window.document
        const products = document.getElementsByClassName("sc-162ysh3-1")
        const results = []
        let i
        for(i=0; i < products.length; i++) {
            results.push(new Cable(products[i]))
        }
        results.sort((a, b) => a.unitPrice-b.unitPrice)
        console.log(results)
    })