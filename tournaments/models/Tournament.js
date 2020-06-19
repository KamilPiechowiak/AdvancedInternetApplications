const Sequelize = require("sequelize")
const sequelize = require("./sequelize")
const Model = require("./Model")
const User = require("./User")
const timeUtils = require("./timeUtils")

class Tournament extends Model {
    getTournamentDateTime() {
        return timeUtils.dateToHtmlDateTime(this.time).join(" ")
    }
    getApplicationDeadlineDateTime() {
        return timeUtils.dateToHtmlDateTime(this.applicationDeadline).join(" ")
    }
    updateDisplayedDates() {
        this.displayedDate = timeUtils.dateToHtmlDate(this.time)
        this.displayedTime = timeUtils.dateToHtmlTime(this.time)
        this.displayedApplicationDeadlineDate = timeUtils.dateToHtmlDate(this.applicationDeadline)
        this.displayedApplicationDeadlineTime = timeUtils.dateToHtmlTime(this.applicationDeadline)
    }
}

Tournament.init({
    name: {
        type: Sequelize.STRING,
        validate: {
            len: {
                args: [2, 64],
                msg: "Name length should be between 2 and 64 characters"
            }
        }
    },
    discipline: {
        type: Sequelize.STRING,
        validate: {
            len: {
                args: [2, 64],
                msg: "Discipline length should be between 2 and 64 characters"
            }
        }
    },
    time: {
        type: Sequelize.DATE,
        validate: {
            isDate: {
                args: true,
                msg: "Please provide valid date and time"
            }
        }
    },
    latitude: {
        type: Sequelize.FLOAT,
        validate: {
            max: 90,
            min: -90,
            isFloat: true
        }
    },
    longitude: {
        type: Sequelize.FLOAT,
        validate: {
            max: 180,
            min: -180,
            isFloat: true
        }
    },
    maxParticipants: {
        type: Sequelize.INTEGER,
        validate: {
            min: {
                args: 2,
                msg: "Maximum number of participants should be at least 2"
            },
            isInt: {
                args: true,
                msg: "Has to be an integer"
            },
            isPowerOfTwo(value) {
                let a = value
                while(a > 1) {
                    if(a%2) {
                        throw new Error("Max number of participants has to be a power of 2")
                    }
                    a=Math.floor(a/2)
                }
            }
        }
    },
    applicationDeadline: {
        type: Sequelize.DATE,
        validate: {
            isDate: {
                args: true,
                msg: "Please provide valid date and time"
            }
        }
    },
    active: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
}, {sequelize, modelName: "tournament"})

Tournament.belongsTo(User, {
    as: "organizer"
})

module.exports = Tournament