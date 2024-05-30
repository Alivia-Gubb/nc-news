const { getArticlesById, getAllArticles  } = require('./controllers/articles.controller');
const { getAllTopics } = require('./controllers/topics.controller')
const { getEndPoints } = require('./controllers/api.controller') 
const express = require('express');
const app = express();



app.get('/api/topics', getAllTopics );

app.get('/api', getEndPoints);

app.get('/api/articles/:article_id',getArticlesById )

app.get('/api/articles', getAllArticles)


app.use((err,req,res,next) => {
    console.log(err);
    res.status(err.status).send({ msg : err.msg })
})

module.exports = app;