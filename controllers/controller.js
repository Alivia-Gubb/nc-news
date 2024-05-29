const { fetchAllTopics } = require('../models/model')
const fs = require("fs")
const endpoints = require('../endpoints.json')


const getAllTopics = (req,res,next) => {
    fetchAllTopics()
    .then((topics) => {
        res.status(200).send({topics})
    })

}
const getEndPoints = (req,res,next) => {
    res.status(200).send(endpoints)
}



module.exports = {getAllTopics, getEndPoints}