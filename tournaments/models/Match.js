const Sequelize = require("sequelize")
const sequelize = require("./sequelize")
const User = require("./User")
const Tournament = require("./Tournament")
const Model = require("./Model")

class Match extends Model {
    updateVerdict(userId, verdict) {
        if(userId == this.player1Id) {
            if(verdict) {
                this.winnerBy1 = 1
            } else {
                this.winnerBy1 = 2
            }
            if(this.realNumberOfParticipants == 1) {
                this.winnerBy1 = 1
                this.winnerBy2 = 1
            }
        } else if(userId == this.player2Id) {
            if(verdict) {
                this.winnerBy2 = 2
            } else {
                this.winnerBy2 = 1
            }
            if(this.realNumberOfParticipants == 1) {
                this.winnerBy1 = 2
                this.winnerBy2 = 2
            }
        }
        let winner = 0
        if(this.winnerBy1 > 0 && this.winnerBy1 == this.winnerBy2) { //they agree about the result
            this.disagreement = false
            winner = this.winnerBy1
        } else if(this.winnerBy1 > 0 && this.winnerBy2 > 0) { //they don't agree
            this.disagreement = true
            this.winnerBy1 = 0
            this.winnerBy2 = 0
        }
        return winner
    }
    getResultForUser(userId) {
        if(this.player1Id == userId) {
            if(this.winnerBy1 == 1 && this.winnerBy2 == 1) {
                return "won"
            } else if(this.winnerBy1 == 2 && this.winnerBy2 == 2) {
                return "lost"
            } else if(this.winnerBy1 == 0) {
                return "enterResult"
            } else {
                return "waiting"
            }
        } else {
            if(this.winnerBy1 == 2 && this.winnerBy2 == 2) {
                return "won"
            } else if(this.winnerBy1 == 1 && this.winnerBy2 == 1) {
                return "lost"
            } else if(this.winnerBy2 == 0) {
                return "enterResult"
            } else {
                return "waiting"
            }
        }
    }
    getPlayerName(id) {
        if(id == 1 && this.player1 != null) {
            return this.player1.getFullName()
        } else if(id ==2 && this.player2 != null) {
            return this.player2.getFullName()
        } else if(this.realNumberOfParticipants == 1) {
            return "None - walkover"
        } else {
            return "Opponent not known yet"
        }
    }
}

Match.init({
    winnerBy1: {
        type: Sequelize.SMALLINT,
        defaultValue: 0
    },
    winnerBy2: {
        type: Sequelize.SMALLINT,
        defaultValue: 0
    },
    layer: {
        type: Sequelize.INTEGER
    },
    disagreement: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    realNumberOfParticipants: {
        type: Sequelize.SMALLINT,
        defaultValue: 2
    }
}, {sequelize, modelName: "match"})

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