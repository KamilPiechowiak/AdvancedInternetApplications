const Sequelize = require("sequelize")
const sequelize = require("./sequelize")
const User = require("./User")

class Tournament extends Sequelize.Model {}

Tournament.init({
    name: {
        type: Sequelize.STRING
    },
    discipline: {
        type: Sequelize.STRING
    },
    time: {
        type: Sequelize.DATE
    },
    latitude: {
        type: Sequelize.FLOAT,
        max: 90,
        min: -90
    },
    longitude: {
        type: Sequelize.FLOAT,
        max: 180,
        min: -180
    },
    maxParticipants: {
        type: Sequelize.INTEGER,
        min: 2,
        isPowerOfTwo(value) {
            let a = value
            while(a) {
                if(a%2) {
                    throw new Error("Max number of participants has to be a power of 2")
                }
                a=Math.floor(a/2)
            }
        }
    },
    applicationDeadline: {
        type: Sequelize.DATE
    },
    active: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
}, {sequelize, modelName: "tournament"})

Tournament.belongsTo(User, {
    as: "organizer"
})

module.exports = Tournament