const express = require('express');
const cookieParser = require('cookie-parser')
const authRouer = require('./router/user.router');

const app = express()
app.use(express.json())
app.use(cookieParser())


app.use('/user', authRouer)

module.exports = app; 