const userModel = require("../models/user.models")
//const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function RegisterController(req,res){

    const {username, email, password, bio, profileImage} = req.body

    // const isUserExist = await userModel.findOne({username})
    // if(isUserExist){
    //     return res.status(409).json({
    //         message:"User Already Exists With this username"
    //     })
    // }


    // const isEmailExists = await userModel.findOne({email})
    // if(isEmailExists){
    //     return res.status(409).json({
    //         message:"User already Exists With This Email"
    //     })
    // }


    const isUserExists = await userModel.findOne({
        $or:[{email},{username}]
    })

    if(isUserExists){
        const feild = isUserExists.email === email ? "Email":"Username"
        return res.status(409).json({
            message:`${feild} already exists`
        })
    }

    // this code is for crypto if we are using crypto for hasing the password
    // const hashPassword = crypto.createHash('sha256').update(password).digest('hex')

    const hashPassword = await bcrypt.hash(password,10)

    const user = await userModel.create({
        username, email, password:hashPassword, bio, profileImage
    })

    const token = jwt.sign({id:user._id}, process.env.jwt_secret, {expiresIn:"1d"})

    res.cookie('jwt', token)

    res.status(201).json({
        message:"User Registered succesfully", 
        user:{
            username:user.username,
            email:user.email,
            bio:user.bio,
            profileImage:user.profileImage
        },
        token
    })
}

async function LoginController(req,res){
    const {email, password, username} = req.body

    const user = await userModel.findOne({
        $or:[{username},{email}]
    })

    if(!user){
        const feild = email? "Email":"Username"
        return res.status(404).json({
            message:`${feild} Does Not Exist Signup/Register First`
        })
    }
    // const hashPassword = crypto.createHash('sha256').update(password).digest('hex')
    // const isPasswordValid = hashPassword === isUserExists.password



    // yahan do kam ho rahe login ke time jo password ayya hai usko 
    // convert karo hash mein and then compare karo apke current wale 
    // password se


    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(!isPasswordValid){
        return res.status(401).json({
            message:"Invalid Credentials / Password Is Invalid"
        })
    }

    const token = jwt.sign({id:user._id}, process.env.jwt_secret, {expiresIn:"1d"})

    res.cookie('jwt', token)

    res.status(200).json({
        message:"User Logged In Successfully", 
        user:{
            username:user.username,
            email: user.email,
            bio:user.bio,
            profileImage:user.profileImage
        }
    })
}

module.exports = {
    RegisterController, LoginController
}