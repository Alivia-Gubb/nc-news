const { fetchAllTopics } = require('../models/model')

const getAllTopics = (req,res,next) => {
    fetchAllTopics()
    .then((topics) => {
        res.status(200).send({topics})
    })

}



module.exports = {getAllTopics}