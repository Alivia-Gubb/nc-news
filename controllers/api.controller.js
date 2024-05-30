const { } = require("../models/articles.model");
const endpoints = require("../endpoints.json");

const getEndPoints = (req, res, next) => {
    res.status(200).send(endpoints);
};

module.exports = { getEndPoints}