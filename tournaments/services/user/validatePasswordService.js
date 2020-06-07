module.exports = {
    validatePassword: (password, confirmPassword) => {
        validation = {}
        if(password !== confirmPassword) {
            Object.assign(validation, {"confirmPassword": ["Passwords do not match"]})
        }
        if(password.length < 6) {
            Object.assign(validation, {"password": ["Password should be at least 6 characters long"]})
        }
        return validation
    }
}