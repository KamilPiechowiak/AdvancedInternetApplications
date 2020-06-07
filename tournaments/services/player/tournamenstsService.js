const models = require("../../models")
const pageSize = 10

module.exports = {
    getTournaments: async (options) => {
        const page = parseInt(options.page)
        if(!page) {
            throw("InvalidPageNumber")
        }
        const selection = {
            where: {
                playerId: options.userId
            },
            include: [{
                model: models.Tournament,
                as: "tournament",
            }],
            offset: (page-1)*pageSize,
            limit: pageSize,
            order: [ [{model: models.Tournament, as: "tournament"}, "time"] ]
        }
        if(options.past) {
            selection.include[0].where = { time: { [Op.lt]: new Date()}}
            selection.order = [ [{model: models.Tournament, as: "tournament"}, "time", "DESC"] ]
        } else {
            selection.include[0].where = { time: { [Op.gt]: new Date()}}
        }
        if(options.search) {
            selection.include[0].where[[Op.or]] = [
                { name: {[Op.like]: `%${options.search}%`}},
                { discipline: {[Op.like]: `%${options.search}%`}}
            ]
        }
        const res = await models.UserTournament.findAndCountAll(selection)
        const tournaments = res.rows.map(userTournament => userTournament.tournament)
        return {
            totalPages: Math.ceil(res.count/pageSize),
            array: tournaments,
            past: options.past,
        }
    },
    checkIfItIsPossibleToRegister: async (id) => {
        const tournament = await models.Tournament({
            where: {id: id}
        })
        if(!tournament) {
            throw("NotFound")
        }
        if(tournament.applicationDeadline < new Date()) {
            throw("applicationDeadlineHasPassed")
        }
        const registeredAlready = models.UserTournament.count({
            where: {
                tournamentId: tournament.id,
            }
        })
        if(registeredAlready == tournament.maxParticipants) {
            throw("participantsLimitReached")
        }
    },

    registerForTournament: async (id, data, user) => {
        await models.sequelize.transaction(async t => {
            const tournament = await models.Tournament.getTournaments({
                where: {id: id},
                transaction: t,
                lock: t.LOCK
            })
            if(!tournament) {
                throw("NotFound")
            }
            const registeredAlready = models.UserTournament.count({
                where: {
                    tournamentId: tournament.id,
                }
            })
            if(registeredAlready == tournament.maxParticipants) {
                throw({general: "participantsLimitReached"})
            }
            const userTournament = models.UserTournament.build({
                ranking: data.ranking,
                licenseNumber: data.licenseNumber,
                playerId: user.id,
                tournamentId: tournament.id
            })
            await userTournament.validate()
            await userTournament.save()
        })
    }
}