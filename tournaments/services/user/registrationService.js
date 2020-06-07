const bcrypt = require("bcrypt")
const crypto = require("crypto")
const User = require("../../models/User")
const validatePasswordService = require("./validatePasswordService")
const mailingService = require("./mailingService")

module.exports = {
    register: async (data) => {
        validation = {}
        Object.assign(validation, validatePasswordService.validatePassword(data.password, data.confirmPassword))
        const users = await User.findAll({where: {email: data.email}})
        if(users.length > 0) {
            const user = users[0]
            if(user.active) {
                throw({general: "accountAlreadyExists"})
            } else {
                user.destroy()
            }
        }
        const expirationDate = new Date()
        expirationDate.setDate(expirationDate.getDate()+1)
        const user = User.build({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            active: false,
            activateToken: crypto.randomBytes(64).toString("hex"),
            activateTokenExpritationDate: expirationDate
        })
        await user.setPassword(data.password)
        try {
            await user.validate()
        } catch(err) {
            Object.assign(validation, err)
        }
        if(Object.keys(validation).length > 0) {
            throw(validation)
        }
        user.save().then( ()=>
            {return mailingService.sendActivateAccountMessage(user.email, user.activateToken)}
        ).catch(err => console.log(err))
    },

    activate: async (token) => {
        const users = await User.findAll({where: {activateToken: token}})
        if(users.length == 0) {
            return "noSuchAccount"
        }
        const user = users[0]
        if(user.activateTokenExpritationDate < new Date()) {
            return "activationTokenExpired"
        }
        user.active = true
        user.activateToken = null
        user.save()
        return "accountActivated"
    }
}