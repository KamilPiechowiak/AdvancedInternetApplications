const Sequelize = require("sequelize")
const sequelize = require("./sequelize")
const User = require("./User")
const Tournament = require("./Tournament")

const UserTournament = sequelize.define("userTournament", {
    ranking: {
        type: Sequelize.INTEGER,
        validate: {
            min: 1
        }
    },
    licenseNumber: {
        type: Sequelize.STRING,
    }
}, {
    indexes: [
        {fields: ["playerId"]},
        {fields: ["tournamentId"]},
        {unique: true, fields: ["tournamentId", "playerId"]},
        {unique: true, fields: ["tournamentId", "ranking"]},
        {unique: true, fields: ["tournamentId", "licenseNumber"]}
    ]
})

UserTournament.belongsTo(User, {
    as: "player",
})

UserTournament.belongsTo(Tournament, {
    as: "tournament",
    onDelete: "CASCADE"
})

module.exports = UserTournament