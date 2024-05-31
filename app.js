const { getArticlesById, getAllArticles, getArticleComments, addComment  } = require('./controllers/articles.controller');
const { getAllTopics } = require('./controllers/topics.controller')
const { getEndPoints } = require('./controllers/api.controller') 
const bodyParser = require('body-parser')

const express = require('express');
const app = express();

app.use(bodyParser.json());

app.get('/api/topics', getAllTopics );

app.get('/api', getEndPoints);

app.get('/api/articles/:article_id',getArticlesById )

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id/comments', getArticleComments)

app.post('/api/articles/:article_id/comments', addComment)


app.use((err,req,res,next) => {
    console.log(err);
    res.status(err.status).send({ msg : err.msg })
})

module.exports = app;