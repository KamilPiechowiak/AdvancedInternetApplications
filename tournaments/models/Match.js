const Sequelize = require("sequelize")
const sequelize = require("./sequelize")
const User = require("./User")
const Tournament = require("./Tournament")

const Match = sequelize.define("match", {
    firstWon: {
        type: Sequelize.BOOLEAN
    },
    layer: {
        type: Sequelize.INTEGER
    }
})

Match.belongsTo(User, {
    as: "player1"
})

Match.belongsTo(User, {
    as: "player2"
})

Match.belongsTo(Tournament, {
    as: "tournament",
    onDelete: "CASCADE"
})

Match.belongsTo(Match, {
    as: "previousMatch1"
})

Match.belongsTo(Match, {
    as: "previousMatch2"
})

module.exports = Match