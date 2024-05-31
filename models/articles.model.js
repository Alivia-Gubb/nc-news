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
const updateArticleVotes = (articleId, newVotes) => {
    // check if articleId is a number
    if(!Number(articleId)) {
        return Promise.reject({
            status : 400,
            msg : 'Invalid ID'
        });
    }
    
    // check if there are votes
    if(!newVotes) {
        return Promise.reject({
            status : 400,
            msg : 'Empty body'
        });
    }

    // check if votes is number
    if(!Number(newVotes)) {
        return Promise.reject({
            status : 400,
            msg : 'Incorrect body'
        });
    }
    return db
        .query(`
            UPDATE articles
            SET votes = votes + $1
            WHERE article_id = $2
            RETURNING *;
        `, [ newVotes, articleId ])
        .then(({ rows }) => {
            // check if any rows updated
            if (rows.length === 0) {
                return Promise.reject({
                    status : 404,
                    msg : `No article found with ID: ${articleId}`
                })
            }

            return rows[0]
        })
}

const deleteComment = (commentId) => {
    // check if commentId is a number
    if(!Number(commentId)) {
        return Promise.reject({
            status : 400,
            msg : 'Invalid ID'
        });
    }

    return db.query(`
        DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *;
    `, [ commentId ])
    .then(({ rows }) => {
        // check if any rows updated
        if (rows.length === 0) {
            return Promise.reject({
                status : 404,
                msg : `No comment found with ID: ${commentId}`
            })
        }

        return rows[0]
    })
}

module.exports = {fetchArticlesById, fetchArticles, fetchArticleComments, insertComment, updateArticleVotes, deleteComment};