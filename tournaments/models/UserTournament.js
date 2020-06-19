const Sequelize = require("sequelize")
const sequelize = require("./sequelize")
const User = require("./User")
const Tournament = require("./Tournament")
const Model = require("./Model")



class UserTournament extends Model {}

UserTournament.init({
    ranking: {
        type: Sequelize.INTEGER,
        validate: {
            isInt: {
                args: true,
                msg: "Ranking has to be an integer"
            },
            min: {
                args: 1,
                msg: "Ranking should be not less than 1"
            }
        }
    },
    licenseNumber: {
        type: Sequelize.STRING,
    },
}, {
    sequelize,
    modelName: "userTournaments",
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