const messages = require("../strings/messages")

module.exports = {
    redirectTo: function(req, defaultPath="/") {
        if(!req.session || !req.session.redirectTo) {
            return defaultPath
        } else {
            const path = req.session.redirectTo
            req.session.redirectTo = undefined
            return path
        }
    },
    getMessage: function(req) {
        if(!req.session || !req.session.message) {
            return undefined
        } else {
            const message = req.session.message
            req.session.message = undefined
            return messages[message]
        }
    }
}