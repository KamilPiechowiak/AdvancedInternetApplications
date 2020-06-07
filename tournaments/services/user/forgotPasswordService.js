const User = require("../../models/User")
const validatePasswordService = require("./validatePasswordService")
const mailingService = require("./mailingService")
const crypto = require("crypto")

module.exports = {
    forgotPassword: async (email) => {
        const user = await User.findOne({where: {email: email}})
        if(user) {
            user.resetPasswordToken = crypto.randomBytes(64).toString("hex")
            const expirationDate = new Date()
            expirationDate.setDate(expirationDate.getDate()+1)
            user.resetPasswordTokenExpirationDate = expirationDate
            user.save().then(()=> {
                mailingService.sendResetPasswordMessage(user.email, user.resetPasswordToken)
            })
        } else {
            throw("noSuchEmail")
        }
    },
    resetPassword: async (data, token) => {
        validation = {}
        Object.assign(validation, validatePasswordService.validatePassword(data.password, data.confirmPassword))
        if(Object.keys(validation).length > 0) {
            throw(validation)
        }
        user = await User.findOne({where: {resetPasswordToken: token}})
        if(!user) {
            throw({general: "passwordAlreadyReset"})
        }
        if(user.resetPasswordTokenExpirationDate < new Date()) {
            throw({general: "resetPasswordTokenExpired"})
        }
        await user.setPassword(data.password)
        user.resetPasswordToken = null
        user.save()
    },
    checkIfResetTokenExists: async (token) => {
        const user = await User.findOne({where: {resetPasswordToken: token}})
        return user != null
    }
}