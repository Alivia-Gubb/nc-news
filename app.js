const { getAllTopics, getEndPoints, getArticlesById }= require('./controllers/controller')
const express = require('express');
const app = express();



app.get('/api/topics', getAllTopics );

app.get('/api', getEndPoints);

app.get('/api/articles/:article_id',getArticlesById )

app.use((err,req,res,next) => {
    console.log(err);
    res.status(err.status).send({ msg : err.msg })
})

module.exports = app;