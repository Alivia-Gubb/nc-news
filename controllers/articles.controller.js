const { fetchArticlesById, fetchArticles } = require("../models/articles.model");

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

module.exports = { getArticlesById, getAllArticles }