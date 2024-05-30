const db = require('../db/connection')

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

const fetchArticles = () => {
    return db.query("SELECT * FROM articles")
        .then((result) => {
            return result.rows
        })
}
// WIP
// const fetchArticleComments = (articleId) => {
//     return db.query(
//         `SELECT 
//         comments.comment_id,
//         comments.votes,
//         comments.created_at,
//         comments.author,
//         comments.body,
//         comments.article_id
//         COUNT (comments.comment_id) AS comment_count
//         FROM 
//         articles
//         LEFT JOIN 
//         comments
//         ON 
//         articles.article_id = comments.article_id
//         WHERE
//         articles.article_id = $1
//         GROUP BY 
//         articles.article_id
//         ORDER BY 
//         articles.created_at;`,
//         [ articleId ]
//     )
//     .then((result) => {
//         return result.rows;
//     });
// }


module.exports = {fetchArticlesById, fetchArticles};