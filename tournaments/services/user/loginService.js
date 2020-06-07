const User = require("../../models/User")

module.exports = {
    serializeUser: (user) => {
        return user.id
    },
    deserializeUser: async(id) => {
        try {
            const user = await User.findOne({where: {id: id}})
            return user
        } catch(err) {
            console.log(err)
            return null
        }
    },
    login: async(data) => {
        return User.findOne({ where: {email: data.email} })
            .then(async user => {
                if (!user || !(await user.validatePassword(data.password))) {
                    throw("invalidCredentials")
                }
                if(!user.active) {
                    throw("accountNotActivated")
                }
                user.activateToken = null
                user.resetPasswordToken = null
                user.save()
                return user
            })
    }
}