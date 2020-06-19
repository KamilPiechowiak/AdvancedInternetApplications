const Sequelize = require("sequelize")
const sequelize = require("./sequelize")
const Model = require("./Model")
const bcrypt = require("bcrypt")

class User extends Model {
    
    async setPassword(password) {
        this.passwordHash = await bcrypt.hash(password, 10)
    }
    
    async validatePassword(password) {
        return await bcrypt.compare(password, this.passwordHash)
    }

    getFullName() {
        return [this.firstName, this.lastName].join(" ")
    }
}

User.init({
    firstName: {
        type: Sequelize.STRING(64),
        validate: {
            len: {
                args: [2, 64],
                msg: "First name length should be between 2 and 64 characters"
            }
        }
    },
    lastName: {
        type: Sequelize.STRING(64),
        validate: {
            len: {
                args: [2, 64],
                msg: "Last name length should be between 2 and 64 characters"
            }
        }
    },
    email: {
        type: Sequelize.STRING,
        validate: {
            isEmail: {
                args: true,
                msg: "Please enter valid email"
            }
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