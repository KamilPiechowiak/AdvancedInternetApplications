const config = require("../../config")
const nodemailer = require("nodemailer")
const ejs = require("ejs")

module.exports = {
    sendActivateAccountMessage: async (email, token) => {
        const transporter = nodemailer.createTransport(config.nodemailer)
        transporter.sendMail({
            from: '"Pokemon tournaments" <noreply@pokemontournaments.com>',
            to: email,
            subject: "Pokemon tournaments: Activate your account",
            html: await ejs.renderFile("views/user/activateMail.ejs", {url: `${config.url}/user/activate/${token}`})
        })
    },
    sendResetPasswordMessage: async (email, token) => {
        const transporter = nodemailer.createTransport(config.nodemailer)
        transporter.sendMail({
            from: '"Pokemon tournaments" <noreply@pokemontournaments.com>',
            to: email,
            subject: "Pokemon tournaments: Password reset request",
            html: await ejs.renderFile("views/user/resetPasswordMail.ejs", {url: `${config.url}/user/resetpassword/${token}`})
        })
    }
}