const { getAllTopics, getEndPoints }= require('./controllers/controller')
const express = require('express');
const app = express();



app.get('/api/topics', getAllTopics );

app.get('/api', getEndPoints);


module.exports = app;