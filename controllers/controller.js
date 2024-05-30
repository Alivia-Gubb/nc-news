const { fetchAllTopics, fetchArticlesById } = require("../models/model");
const fs = require("fs");
const endpoints = require("../endpoints.json");

const getAllTopics = (req, res, next) => {
    fetchAllTopics().then((topics) => {
    res.status(200).send({ topics });
});
};
const getEndPoints = (req, res, next) => {
    res.status(200).send(endpoints);
};

const getArticlesById = (req, res,next) => {
    fetchArticlesById(req.params.article_id)
        .then((article) => {
            res.status(200).send({ article })
        })
        .catch(next);
};

module.exports = { getAllTopics, getEndPoints, getArticlesById };
