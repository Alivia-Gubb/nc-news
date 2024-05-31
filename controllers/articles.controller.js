const { fetchArticlesById, fetchArticles, fetchArticleComments, insertComment } = require("../models/articles.model");

const fs = require("fs");

const getArticlesById = (req, res,next) => {
    fetchArticlesById(req.params.article_id)
        .then((article) => {
            res.status(200).send({ article })
        })
        .catch(next);
};

const getAllArticles = (req, res, next) => {
    fetchArticles().then((articles) => {
        res.status(200).send({ articles })
    })
}

const getArticleComments = (req, res, next) => {
    fetchArticleComments(req.params.article_id).then((comments) => {
        res.status(200).send({ comments })
    }).catch(next)
}

const addComment = (req, res, next) => {
    const articleId = req.params.article_id
    const comment = req.body
    insertComment(articleId, comment)
        .then((comment) => {
            res.status(201).send({ comment })
        })
        .catch(next)
}

module.exports = { getArticlesById, getAllArticles, getArticleComments, addComment }