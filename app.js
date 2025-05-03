const express = require('express');
const logger = require('./config/logger');
const uploadRoute = require('./routes/uploadRoute');

require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/', uploadRoute);

module.exports = app;
