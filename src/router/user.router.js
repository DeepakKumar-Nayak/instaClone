const express = require('express')
const { RegisterController, LoginController } = require('../controller/auth.controller')
const authRouer = express.Router()


authRouer.post('/register', RegisterController)
authRouer.post('/login', LoginController)

module.exports = authRouer