const Sequelize = require("sequelize")
const sequelize = require("./sequelize")
const bcrypt = require("bcrypt")

class User extends Sequelize.Model {
    
    async setPassword(password) {
        this.passwordHash = await bcrypt.hash(password, 10)
    }
    
    async validatePassword(password) {
        return await bcrypt.compare(password, this.passwordHash)
    }


}

User.init({
    firstName: {
        type: Sequelize.STRING(64)
    },
    lastName: {
        type: Sequelize.STRING(64)
    },
    email: {
        type: Sequelize.STRING,
        validate: {
            isEmail: true
        }
    },
    passwordHash: {
        type: Sequelize.STRING
    },
    resetPasswordToken: {
        type: Sequelize.STRING
    },
    resetPasswordTokenExpirationDate: {
        type: Sequelize.DATE
    },
    active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    },
    activateToken: {
        type: Sequelize.STRING,
    },
    activateTokenExpritationDate: {
        type: Sequelize.DATE
    }
}, {sequelize, modelName: "user"})

module.exports = User