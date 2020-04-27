const pgp = require('pg-promise')(/* options */)
const config = require("./config")
const db = pgp(config.db)

async function getProducts(ids, quantities=[]) {
    if(ids == undefined) {
        return []
    }
    const queries = ids.map(id => db.any("select * from products where id = $1", id))
    const products = []
    for(let i=0; i < ids.length; i++) {
        const arr = await queries[i]
        if(quantities.length > 0) {
            arr[0].quantity = quantities[i]
        }
        if(arr.length > 0) {
            products.push(arr[0])
        }
    }
    return products
}

async function getAllProducts() {
    const products = await db.any("select * from products where quantity > 0")
    console.log(products)
    return products.sort((a, b) => a.id-b.id)
}

async function tryOrderingProducts(productsInfo) {
    productsInfo = productsInfo.concat()
    productsInfo.sort((a, b) => a.id-b.id)
    return db.tx(async t => {
        const queries = productsInfo.map(p => t.any("select quantity from products where id = $1 for update", p.id))
        const notAvailable = []
        for(let i=0; i < queries.length; i++) {
            const arr = await queries[i]
            if(arr.length == 0) {
                continue
            }
            const product = arr[0]
            if(product.quantity < productsInfo[i].quantity) {
                notAvailable.push(productsInfo[i].id)
            }
        }
        if(notAvailable.length == 0) {
            const updates = productsInfo.map(p => t.none("update products set quantity = quantity-$1 where id=$2", [p.quantity, p.id]))
            for(let i=0; i < updates.length; i++) {
                await updates[i]
            }
        }
        return notAvailable
    })
}

module.exports = {
    getProducts: getProducts,
    getAllProducts: getAllProducts,
    tryOrderingProducts: tryOrderingProducts
}

if(require.main == module) {
    getProducts([1, 3, 4])
}