const models = require("../../models")
const pageSize = 10

const getSelectionFromOptions = (options) => {
    const page = parseInt(options.page)
    if(!page) {
        throw("InvalidPageNumber")
    }
    const selection = {
        offset: (page-1)*pageSize,
        limit: pageSize,
    }
    if(options.past) {
        selection.where = { time: { [Op.lt]: new Date()}}
        selection.order = [["time", "DESC"]]
    } else {
        selection.where = { time: { [Op.gt]: new Date()}}
        selection.order = [["time"]]
    }
    if(options.organizerId) {
        selection.where.organizerId = options.organizerId
    }
    if(options.search) {
        selection.where[[Op.or]] = [
            { name: {[Op.like]: `%${options.search}%`}},
            { discipline: {[Op.like]: `%${options.search}%`}}
        ]
    }
    return selection
}

const checkIfCurrentUserRegistered = async (id, userId) => {
    const userTournament = await models.UserTournament.findOne({
        where: {
            "tournamentId": id,
            "playerId": userId
        }
    })
    if(userTournament) {
        return true
    }
    return false
}

module.exports = {
    getTournaments: async (options) => {
        const selection = getSelectionFromOptions(options)
        const res = await models.Tournament.findAndCountAll(selection)
        if(!res.rows.length && page != 1) {
            throw("NoRows")
        }
        return {
            totalPages: Math.ceil(res.count/pageSize),
            array: res.rows,
            past: options.past,
        }
    },
    getSingle: async (id, userId) => {
        const tournament = await models.Tournament.findOne({where: {id: id}})
        if(!tournament) {
            throw("NotFound")
        }
       tournament.registered = checkIfCurrentUserRegistered(id, userId)
        return tournament
    }
}