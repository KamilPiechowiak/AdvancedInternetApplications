const models = require("../../models")
const Op = require("sequelize").Sequelize.Op
const pageSize = 4

const checkIfCurrentUserAlreadyRegistered = async (tournamentId, userId) => {
    const ut = await models.UserTournament.count({
        where: {
            playerId: userId,
            tournamentId: tournamentId
        }
    })
    if(ut) {
        return true
    }
    return false
} 

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
            selection.include[0].where[Op.or] = [
                { name: {[Op.iLike]: `%${options.search}%`}},
                { discipline: {[Op.iLike]: `%${options.search}%`}}
            ]
        }
        const res = await models.UserTournament.findAndCountAll(selection)
        const tournaments = res.rows.map(userTournament => userTournament.tournament)
        if(!tournaments.length && options.page != 1) {
            throw("NoRows")
        }
        return {
            totalPages: Math.ceil(res.count/pageSize),
            tournaments: tournaments,
            past: options.past,
        }
    },
    checkIfItIsPossibleToRegister: async (id, user) => {
        const tournament = await models.Tournament.findOne({
            where: {id: id}
        })
        if(!tournament) {
            throw("NotFound")
        }
        if(tournament.applicationDeadline < new Date()) {
            throw("applicationDeadlineHasPassed")
        }
        const registeredAlready = await models.UserTournament.count({
            where: {
                tournamentId: tournament.id,
            }
        })
        if(registeredAlready == tournament.maxParticipants) {
            throw("participantsLimitReached")
        }
        if(await checkIfCurrentUserAlreadyRegistered(id, user.id)) {
            throw("alreadyRegistered")
        }
    },

    registerForTournament: async (id, data, user) => {
        await models.sequelize.transaction(async t => {
            const tournament = await models.Tournament.findOne({
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
            if(await checkIfCurrentUserAlreadyRegistered(id, user.id)) {
                throw({general: "alreadyRegistered"})
            }
            const userTournament = models.UserTournament.build({
                ranking: data.ranking,
                licenseNumber: data.licenseNumber,
                playerId: user.id,
                tournamentId: tournament.id
            })
            const validation = await userTournament.validate()
            if(Object.keys(validation).length > 0) {
                throw(validation)
            }
            userTournament.ranking = parseInt(userTournament.ranking)
            try {
                await userTournament.save({
                    transaction: t
                })
            } catch(err) {
                throw({general: "nonUniqueRanking"})
            }
        })
        return "registeredSuccessfully"
    }
}