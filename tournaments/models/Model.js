const Sequelize = require("sequelize")

class Model extends Sequelize.Model {
    async validate() {
        const validation = {}
        try {
            await super.validate()
        } catch(err) {
            for(let i=0; i < err.errors.length; i++) {
                const error = err.errors[i]
                validation[error.path] = [error.message]
            }
        }
        return validation
    }
}

module.exports = Model