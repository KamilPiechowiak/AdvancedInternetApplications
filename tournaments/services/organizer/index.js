const models = require("../../models")
const timeUtils = require("../../models/timeUtils")

module.exports = {
    getTournament: async (id, user) => {
        if(id == 0) {
            return models.Tournament.build()
        }
        const tournament = await models.Tournament.findOne({where: {
            id: id,
            organizerId: user.id
        }})
        if(!tournament) {
            throw("NotFound")
        }
        tournament.updateDisplayedDates()
        return tournament
    },
    saveTournament: async (id, data, user) => {
        let tournament = models.Tournament.build()
        if(id != 0) {
            tournament = await models.Tournament.findOne({where: {
                id: id,
                organizerId: user.id
            }})
            if(!tournament) {
                throw("NotFound")
            }
        }
        validation = {}
        data.time = timeUtils.htmlToDate(data.displayedDate, data.displayedTime)
        data.applicationDeadline = timeUtils.htmlToDate(data.displayedApplicationDeadlineDate, data.displayedApplicationDeadlineTime)
        if(id == 0 && data.time < new Date()) {
            validation["displayedDate"] = ["You can't host tournaments in the past"]
        } else if(id != 0 && tournament.time < new Date() && tournament.time.toGMTString() != data.time.toGMTString()) {
            validation["displayedDate"] = ["You can't change date of the past tournament"]
        }
        if(tournament.time < data.applicationDeadline) {
            validation["displayedApplicationDeadlineDate"] = ["Application deadline can't be later than tournament time"]
        }
        if(id != 0 && tournament.time < new Date() && tournament.applicationDeadline.toGMTString() != data.applicationDeadline.toGMTString()) {
            validation["displayedApplicationDeadlineDate"] = ["You can't change application deadline of the past tournament"]
        }
        tournament.name = data.name
        tournament.discipline = data.discipline
        tournament.time = data.time
        tournament.latitude = data.latitude
        tournament.longitude = data.longitude
        tournament.maxParticipants = data.maxParticipants
        tournament.applicationDeadline = data.applicationDeadline
        tournament.organizerId = user.id        
        
        Object.assign(validation, await tournament.validate())
        if(Object.keys(validation).length > 0) {
            if(validation.time) {
                validation.displayedDate = validation.time
            }
            if(validation.applicationDeadline) {
                validation.displayedApplicationDeadlineDate = validation.applicationDeadline
            }
            throw(validation)
        }

        await tournament.save()
        tournament.updateDisplayedDates()
        return tournament
    }
}