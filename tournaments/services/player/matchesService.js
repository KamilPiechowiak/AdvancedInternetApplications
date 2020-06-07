const models = require("../../models")

module.exports = {
    getMatches: async (options) => {
        const page = parseInt(options.page)
        if(!page) {
            throw("InvalidPageNumber")
        }
        const selection = {
            where: {
                [Op.or]: {
                    player1: options.userId,
                    player2: options.userId
                }
            },
            include: [{
                model: models.Tournament,
                as: "tournament",
            }],
            offset: (page-1)*pageSize,
            limit: pageSize,
            order: [ [{model: models.Tournament, as: "tournament"}, "time"], ["layer"] ]
        }
        if(options.past) {
            selection.where.winnerBy1 = {
                [Op.and]: [
                    models.sequelize.col("winnerBy2"),
                    { [Op.gt]: 0 }
                ]
            }
            selection.order = [ [{model: models.Tournament, as: "tournament"}, "time", "DESC"], ["layer", "DESC"]]
        } else {
            selection.where.winnerBy1 = {
                [Op.or]: [
                    { [Op.ne]: models.sequelize.col("winnerBy2") },
                    0
                ]
            }
        }
        const res = await models.Match.findAndCountAll(selection)
        const tournaments = res.rows.map(userTournament => userTournament.tournament)
        return {
            totalPages: Math.ceil(res.count/pageSize),
            array: tournaments,
            past: options.past,
        }
    },
    updateMatch: async (id, userId, verdict) => {
        await models.sequelize.transaction(async t => {
            const match = await models.Match.findOne({
                where: {
                    id: id
                },
                transaction: t,
                lock: t.LOCK
            })
            if(!match) {
                throw("NotFound")
            }
            const winner = await match.checkWinner(userId, verdict)
            if(winner) {
                let winnerId = match.player1Id
                if(winner == 2) {
                    winnerId = match.player2Id
                }
                const nextmatch = await models.Match.findOne({
                    where: {
                        [Op.or]: { 
                            previousMatch1Id: id,
                            previousMatch2Id: id
                        }
                    }
                })
                if(!nextmatch) {
                    return
                }
                if(nextmatch.previousMatch1Id == id) {
                    nextmatch.player1Id = winnerId
                } else {
                    nextmatch.player2Id = winnerId
                }
            }
        })
    }
}