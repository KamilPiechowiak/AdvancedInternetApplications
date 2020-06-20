const models = require("../../models")
const { User } = require("../../models")
const pageSize = 4
const Op = require("sequelize").Sequelize.Op

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
        selection.where[Op.or] = [
            { name: {[Op.iLike]: `%${options.search}%`}},
            { discipline: {[Op.iLike]: `%${options.search}%`}}
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
        // if(!res.rows.length && options.page != 1) {
        //     throw("NoRows")
        // }
        return {
            totalPages: Math.ceil(res.count/pageSize),
            tournaments: res.rows,
            past: options.past,
        }
    },
    getSingle: async (id, userId) => {
        const tournament = await models.Tournament.findOne({
            where: {id: id},
            include: [{
                model: User,
                as: "organizer"
            },{
                model: models.Image
            }]
        })
        if(!tournament) {
            throw("NotFound")
        }
        tournament.registered = await checkIfCurrentUserRegistered(id, userId)
        tournament.numberOfRegistered = await models.UserTournament.count({
            where: {
                tournamentId: tournament.id
            }
        })
        console.log(tournament)
        return tournament
    },
    getMatches: async (id) => {
        const matches = await models.Match.findAll({
            where: {tournamentId: id},
            include: [
                {model: models.User, as: "player1", attributes: ["firstName", "lastName"]},
                {model: models.User, as: "player2", attributes: ["firstName", "lastName"]}
            ],
            order: [["id", "DESC"]]
        })
        return matches
    }
}