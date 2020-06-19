const seedMatches = require("../services/tournaments/seedingService").seedMatches

seedMatches(null, {
    id: 1,
    maxParticipants: 16,
    save: () => {console.log("saved")},
    active: false
})

