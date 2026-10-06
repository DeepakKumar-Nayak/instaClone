require('dotenv').config()
const app = require('./src/app')
const connectToDB = require('./src/config/db')

connectToDB()

app.listen(3000, function(){
    console.log('server started successfully')
})


