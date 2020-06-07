const models = require("../../models")
const timeUtils = require("../timeUtils")

module.exports = {
    getTournament: async (id, user) => {
        if(id == 0) {
            return await Tournament.build()
        }
        const tournament = await models.Tournament.findOne({where: {
            id: id,
            organizerId: user.id
        }})
        if(!tournament) {
            throw("NotFound")
        }
        return tournament
    },
    saveTournament: async (id, data, user) => {
        let tournament = Tournament.build()
        if(id != 0) {
            tournament = Tournament.findOne({where: {
                id: id,
                organizerId: user.id
            }})
            if(!tournament) {
                throw("NotFound")
            }
        }
        data.time = timeUtils.htmlToDate(data.displayedDate, data.displayedTime)
        data.applicationDeadline = timeUtils.htmlToDate(data.displayedApplicationDeadlineDate, data.displayedApplicationDeadlineTime)
        if(id == 0 && data.time < new Date()) {
            val["displayedDate"] = ["You can't host tournaments in the past"]
        } else if(id != 0 && tournament.time < new Date() && tournament.time != data.time) {
            val["displayedDate"] = ["You can't change date of the past tournament"]
        }
        if(tournament.time < data.applicationDeadline) {
            val["applicationDeadline"] = ["Application deadline can't be later than tournament time"]
        }
        if(id != 0 && tournament.time < new Date() && tournament.applicationDeadline != data.applicationDeadline) {
            val["applicationDeadline"] = ["You can't change application deadline of the past tournament"]
        }
        validation = {}
        tournament.name = data.name
        tournament.discipline = data.discipline
        tournament.time = data.time
        tournament.latitude = data.latitude
        tournament.longitude = data.longitude
        tournament.maxParticipants = data.maxParticipants
        
        try {
            await tournament.validate()
        } catch(err) {
            Object.assign(validation, err)
        }
        if(Object.keys(validation).length > 0) {
            throw(validation)
        }

        await tournament.save()
        tournament.displayedDate = timeUtils.dateToHtmlDate(tournament.time)
        tournament.displayedTime = timeUtils.dateToHtmlTime(tournament.time)
        tournament.displayedApplicationDeadlineDate = timeUtils.dateToHtmlDate(tournament.applicationDeadline)
        tournament.displayedApplicationDeadlineTime = timeUtils.dateToHtmlTime(tournament.applicationDeadline)
        return tournament
    }
}