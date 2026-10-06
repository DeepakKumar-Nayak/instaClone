const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true, 'Username is required'],
        unique:[true, 'Username is already Taken']
    }, 
    email:{
        type:String,
        required:[true, 'Email is required'],
        unique:[true, 'Account already Exists with this Email']
    }, 
    password:{
        type:String,
        required:[true, 'Password is required']
    },
    bio:{
        type:String
    }, 
    profileImage:{
        type:String,
        default:"https://ik.imagekit.io/a014x0h69/Insta%20Clone/360_F_724597608_pmo5BsVumFcFyHJKlASG2Y2KpkkfiYUU.jpg?updatedAt=1791027178813"
    }
})

const userModel = mongoose.model('user', userSchema)
module.exports = userModel