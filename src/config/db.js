const mongoose = require('mongoose')

async function connectToDB(){
    try{
        await mongoose.connect(process.env.mongo_uri)
        console.log('connected to the databse succesfully')
    }catch(error){
        console.log('error in connection to the databse', error.message)
    }
}

module.exports = connectToDB