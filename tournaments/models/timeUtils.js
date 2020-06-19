module.exports = {
    htmlToDate: (date, time) => {
        return new Date(date + "T" + time)
    },
    dateToHtmlDate: (date) => {
        date = new Date(date)
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
        return date.toISOString().substring(0, 10)
    },
    dateToHtmlTime: (date) => {
        date = new Date(date)
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
        return date.toISOString().substring(11, 19)
    },
    dateToHtmlDateTime: (date) => {
        date = new Date(date)
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
        return [date.toISOString().substring(0, 10), date.toISOString().substring(11, 19)]
    }
}