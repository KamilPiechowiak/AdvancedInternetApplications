const CronJob = require('cron').CronJob
const models = require("../../models")
const Op = require("sequelize").Op

const seedMatches = async (t, tournament) => {
    if(tournament.active) {
        return;
    }
    let n = tournament.maxParticipants
    const usersTournament = await models.UserTournament.findAll({
        where: { tournamentId: tournament.id},
        order: [["ranking", "DESC"]],
        transaction: t
    })
    let participants = []
    let newLayer = []
    for(let i = 0; i < tournament.maxParticipants; i++) {
        participants.push({id: null})
    }
    for(let i = 0; n > 1; i++) {
        for(let j=0; j < n/2; j++) {
            const a = j
            const b = n-1-j
            const match = models.Match.build({
                layer: i,
                tournamentId: tournament.id,
                previousMatch1Id: participants[a].id,
                previousMatch2Id: participants[b].id
            })
            if(i == 0) {
                match.player1Id = usersTournament.length > a ? usersTournament[a].playerId : null
                match.player2Id = usersTournament.length > b ? usersTournament[b].playerId : null
                if(match.player1Id == null) {
                    match.realNumberOfParticipants--
                }
                if(match.player2Id == null) {
                    match.realNumberOfParticipants--
                }
            } else {
                if(participants[a].realNumberOfParticipants == 0) {
                    match.realNumberOfParticipants--
                }
                if(participants[b].realNumberOfParticipants == 0) {
                    match.realNumberOfParticipants--
                }
            }
            
            await match.save({
                transaction: t
            })
            newLayer.push(match)
        }
        participants = newLayer
        newLayer = []
        n = Math.floor(n/2)
    }
    tournament.active = true
    return await tournament.save({
        transaction: t
    })
}

const job = new CronJob('13 * * * * *', async function() {
    console.log("Cron job")
    await models.sequelize.transaction(async t => {
        const tournaments = await models.Tournament.findAll({
            where: {
                active: false,
                applicationDeadline: {
                    [Op.lt]: new Date()
                }
            },
            transaction: t,
            lock: t.LOCK
        })
        for(const tournament of tournaments) {
            await seedMatches(t, tournament)
        }
    })
})

module.exports = {
    job: job,
    seedMatches: seedMatches
}