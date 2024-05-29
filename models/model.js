const db = require('../db/connection')

const fetchAllTopics = () => {
    return db.query("SELECT * FROM topics;")
    .then((result) => {
    return result.rows
    })
}


module.exports = {fetchAllTopics,};