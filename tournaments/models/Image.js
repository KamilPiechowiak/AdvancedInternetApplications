const Sequelize = require("sequelize")
const sequelize = require("./sequelize")
const Model = require("./Model")
const Tournament = require("./Tournament")

class Image extends Model {}

Image.init({
    name: {
        type: Sequelize.STRING,
    }
}, {sequelize, modelName: "image"})

Image.belongsTo(Tournament)
Tournament.hasMany(Image)

module.exports = Image