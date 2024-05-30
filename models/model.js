const db = require('../db/connection')

const fetchAllTopics = () => {
    return db.query("SELECT * FROM topics;")
    .then((result) => {
    return result.rows
    })
}

const fetchArticlesById = (articleId) => {
    if(!Number(articleId)) {
        return Promise.reject({
            status : 400,
            msg : 'Bad request'
        });
    }

    return db.query(
        "SELECT * FROM articles WHERE article_id = $1;",
        [ articleId ]
    ).then((result) => {
        const article = result.rows[0]
        if(!article) {
            return Promise.reject({
                status : 404,
                msg : `Article ID does not exist: ${articleId}`
            })
        }
        return article
    });
}


module.exports = {fetchAllTopics,fetchArticlesById};