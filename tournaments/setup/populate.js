const models = require("../models")
const registrationService = require("../services/user/registrationService")
const { sequelize } = require("../models")

const shuffle = (arr) => {
    for(let i=1; i < arr.length; i++) {
        let j = Math.floor(Math.random()*(i+1))
        let t = arr[i]
        arr[i] = arr[j]
        arr[j] = t
    }
}

const registerUser = async (options) => {
    options.confirmPassword = options.password
    try {
        await registrationService.register(options)
    } catch(err) {
        console.log(err)
    }
}

const insertTournaments = async (options) => {
    try {
        users = await models.User.findAll()
        shuffle(users)
        options.organizerId = users[0].id
        const tournament = await models.Tournament.build(options).save()
        const subtract = Math.floor(Math.random()*2.5)
        for(let i=1; i <= tournament.maxParticipants-subtract; i++) {
            const user = users[i]
            models.UserTournament.build({playerId: user.id, tournamentId: tournament.id, ranking: i, licenseNumber: `lic${user.id}`}).save()
        }
    } catch(err) {
        console.log(err)
    }
}

const populate = async() => {
    await sequelize.sync()

    await registerUser({firstName: "Henryk", lastName: "Kamiński", email: "h.c@onet.pl", password: "SuperPassword"})
    await registerUser({firstName: "Piotr", lastName: "Wójcik", email: "p.w@gmail.com", password: "123456"})
    await registerUser({firstName: "Jadwiga", lastName: "Mazur", email: "jadwisia@wp.pl", password: "onojrwnbo"})
    await registerUser({firstName: "Ewa", lastName: "Krawczyk", email: "kewa@example.com", password: "jnwjdnevn"})
    await registerUser({firstName: "Andrzej", lastName: "Olszewski", email: "andriej.ol@outlook.com", password: "BjnuhbUb"})
    await registerUser({firstName: "Zbigniew", lastName: "Sikora", email: "sikoraz@gmail.com", password: "1938pppp"})
    await registerUser({firstName: "Edward", lastName: "Szewczyk", email: "esz@gmail.com", password: "oinjwen20"})
    await registerUser({firstName: "Katarzyna", lastName: "Borowska", email: "kasia@borowska.pl", password: "nihsJI"})
    await registerUser({firstName: "Beata", lastName: "Pietrzak", email: "bp@cukiernia-pietrzak.pl", password: "hasloo"})
    await registerUser({firstName: "Grzegorz", lastName: "Walczak", email: "gw@gazeta.pl", password: "jakiehaslomialemtuwpisac"})

    const date = new Date()
    date.setDate(date.getDate()+2)
    const applicationDate = new Date()
    applicationDate.setDate(applicationDate.getDate()+1)
    await insertTournaments({name: "Holiday tournament", discipline: "IV gen only", latitude: 50.02, longitude: 17.13, time: date, applicationDeadline: applicationDate, maxParticipants: 4, active: false})
    await insertTournaments({name: "June 2020", discipline: "all generations", latitude: 50.02, longitude: 17.13, time: date, applicationDeadline: applicationDate, maxParticipants: 8, active: false})
    await insertTournaments({name: "Tournament", discipline: "only legends", latitude: 50.02, longitude: 17.13, time: date, applicationDeadline: applicationDate, maxParticipants: 4, active: false})
    await insertTournaments({name: "Old school", discipline: "<= II gen", latitude: 50.02, longitude: 17.13, time: date, applicationDeadline: applicationDate, maxParticipants: 4, active: false})
    await insertTournaments({name: "Tiny tournament 3", discipline: "stats <= 400", latitude: 50.02, longitude: 17.13, time: date, applicationDeadline: applicationDate, maxParticipants: 8, active: false})
    await insertTournaments({name: "League 3", discipline: "all generations", latitude: 50.02, longitude: 17.13, time: date, applicationDeadline: applicationDate, maxParticipants: 8, active: false})

    date.setMonth(date.getMonth()-1)
    applicationDate.setMonth(applicationDate.getMonth()-1)
    await insertTournaments({name: "Tiny tournament 2", discipline: "stats <= 400", latitude: 50.02, longitude: 17.13, time: date, applicationDeadline: applicationDate, maxParticipants: 8, active: false})
    await insertTournaments({name: "League 2", discipline: "all generations", latitude: 50.02, longitude: 17.13, time: date, applicationDeadline: applicationDate, maxParticipants: 8, active: false})

    date.setMonth(date.getMonth()-1)
    applicationDate.setMonth(applicationDate.getMonth()-1)

    await insertTournaments({name: "Tiny tournament 1", discipline: "stats <= 400", latitude: 50.02, longitude: 17.13, time: date, applicationDeadline: applicationDate, maxParticipants: 8, active: false})
    await insertTournaments({name: "League 1", discipline: "all generations", latitude: 50.02, longitude: 17.13, time: date, applicationDeadline: applicationDate, maxParticipants: 8, active: false})
    await insertTournaments({name: "Old school", discipline: "only I gen", latitude: 50.02, longitude: 17.13, time: date, applicationDeadline: applicationDate, maxParticipants: 8, active: false})

}
populate()