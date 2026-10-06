const userModel = require("../models/user.models")
const crypto = require('crypto')
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

    const hashPassword = crypto.createHash('sha256').update(password).digest('hex')

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

    const isUserExists = await userModel.findOne({
        $or:[{username},{email}]
    })

    if(!isUserExists){
        const feild = email? "Email":"Username"
        return res.status(404).json({
            message:`${feild} Does Not Exist Signup/Register First`
        })
    }
    const hashPassword = crypto.createHash('sha256').update(password).digest('hex')

    const isPasswordValid = hashPassword === isUserExists.password
    if(!isPasswordValid){
        return res.status(401).json({
            message:"Invalid Credentials"
        })
    }

    const token = jwt.sign({id:isUserExists._id}, process.env.jwt_secret, {expiresIn:"1d"})

    res.cookie('jwt', token)

    res.status(200).json({
        message:"User Logged In Successfully", 
        user:{
            username:isUserExists.username,
            email: isUserExists.email,
            bio:isUserExists.bio,
            profileImage:isUserExists.profileImage
        }
    })
}

module.exports = {
    RegisterController, LoginController
}