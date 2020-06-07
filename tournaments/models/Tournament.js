const Sequelize = require("sequelize")
const sequelize = require("./sequelize")
const User = require("./User")

Sequelize

const Tournament = sequelize.define("tournament", {
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
        min: 2
    }
})

Tournament.belongsTo(User, {
    as: "organizer"
})

module.exports = Tournament