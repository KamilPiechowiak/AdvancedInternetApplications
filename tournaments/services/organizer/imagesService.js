const imageType = require('image-type')
const models = require("../../models")
const util = require("util")
const fs = require("fs")

module.exports = {
    saveImages: async(tournament, files) => {
        const promises = []
        for(file of files) {
            const type = imageType(file.data)
            if(type == null) {
                continue
            }
            const image = await models.Image.build({
                tournamentId: tournament.id
            }).save()
            image.name = `${image.id}.${type.ext}`
            promises.push(image.save())
            promises.push(file.mv(`public/img/${image.name}`))
        }
        for(const promise of promises) {
            await promise
        }
    },
    deleteImage: async(id, user) => {
        const image = await models.Image.findOne({
            where: {
                id: id
            },
            include: {
                model: models.Tournament,
                include: {
                    model: models.User,
                    as: "organizer"
                }
            }
        })
        if(!image) {
            throw("NotFound")
        }
        if(image.tournament.organizer.id != user.id) {
            throw("NotAllowed")
        }
        const unlink = util.promisify(fs.unlink)
        await unlink(`public/img/${image.name}`)
        await image.destroy()
    }
}