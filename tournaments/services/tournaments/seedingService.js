const CronJob = require('cron').CronJob
const models = require("../../models")
const Op = require("sequelize").Op

const seedMatches = async (tournament) => {
    let n = tournament.maxParticipants
    const usersTournament = await models.UserTournament.findAll({
        where: { tournamentId: tournament.id},
        order: [["ranking", "DESC"]]
    })
    let participants = []
    let newLayer = []
    for(let i = 0; i < tournament.maxParticipants; i++) {
        participants.push(null)
    }
    for(let i = 0; n; i++) {
        for(let j=0; j < n/2; j++) {
            const a = j
            const b = n-1-j
            const match = models.Match.build({
                layer: i,
                tournamentId: tournament.id,
                previousMatch1Id: participants[a],
                previousMatch2Id: participants[b]
            })
            if(i == 1) {
                match.player1Id = usersTournament.length > a ? usersTournament[a] : null
                match.player2Id = usersTournament.length > b ? usersTournament[b] : null
            }
            await match.save()
            newLayer.push([match.id])
        }
        participants = newLayer
        newLayer = []
        n = Math.floor(n/2)
    }
    tournament.active = true
    return await tournament.save()
}

const job = new CronJob('13 * * * * *', async function() {
    console.log("Cron job")
    const tournaments = await models.Tournament.findAll({
        where: {
            active: false,
            applicationDeadline: {
                [Op.lt]: new Date()
            }
        }
    })
    tournaments.forEach(tournament => {
        seedMatches(tournament)
    })
})

module.exports = job