const { fetchAllTopics } = require("../models/topics.model");
const fs = require("fs");

const getAllTopics = (req, res, next) => {
    fetchAllTopics().then((topics) => {
    res.status(200).send({ topics });
});
};

module.exports = { getAllTopics};
