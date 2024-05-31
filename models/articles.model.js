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
    return db.query(`
        SELECT
            articles.author,
            articles.title,
            articles.article_id,
            articles.topic,
            articles.created_at,
            articles.votes,
            articles.article_img_url,
            COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;
    `).then((result) => {
        return result.rows
    })
}

const fetchArticleComments = (articleId) => {
    if(!Number(articleId)) {
        return Promise.reject({
            status : 400,
            msg : 'Bad request'
        });
    }
    return db.query(`
        SELECT
            comment_id,
            votes,
            created_at,
            author,
            body,
            article_id
        FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC;
    `, [ articleId ]).then((result) => {
        if(result.rows.length === 0) {
            return Promise.reject({
                status : 404,
                msg : `No comments found for article with ID: ${articleId}`
            })
        }
        return result.rows
    })
}

const insertComment = (articleId, newComment) => {
    if(!Number(articleId) || !newComment) {
        return Promise.reject({
            status : 400,
            msg : 'Bad request'
        });
    }

    if(!newComment.username || !newComment.body) {
        return Promise.reject({
            status : 400,
            msg : 'Bad request'
        });
    }

    const {username,body} = newComment;
    return db
        .query(`
            INSERT INTO comments
                (
                    author,
                    body,
                    article_id
                )
            VALUES 
                (
                    $1,
                    $2,
                    $3
                )
            RETURNING *;`, [username, body, articleId])
        .then(({ rows }) => rows[0])
}

module.exports = {fetchArticlesById, fetchArticles, fetchArticleComments, insertComment};