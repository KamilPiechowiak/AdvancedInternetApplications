const sequelize = require("./sequelize")
const User = require("./User")
const Tournament = require("./Tournament")
const UserTournament = require("./UserTournament")
const Match = require("./Match")

module.exports = {
    sequelize,
    User,
    Tournament,
    UserTournament,
    Match
}