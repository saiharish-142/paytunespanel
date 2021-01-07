const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const admin = mongoose.model("admin")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/keys')
const adminauth  = require('../authenMiddleware/adminauth')

router.post('/signup',(req,res)=>{
    const { username, password, email, usertype } = req.body
    if(!username || !password || !email || !usertype){
        return res.status(422).json({error:"please enter all the required fields"})
    }
    admin.findOne({email:email})
    .then(saveduser => {
        if(saveduser){
            return res.status(422).json({error:"user already exists..."})
        }
        bcrypt.hash(password,12)
        .then(hashpass => {
            const adminU = new admin({
                username,password:hashpass,email,usertype
            })
            adminU.save()
            .then(savedAdmin => {
                const token = jwt.sign({_id:savedAdmin._id},JWT_SECRET)
                savedAdmin.password = undefined
                res.json({message:"admin saved Successfully...",token,user:savedAdmin})
            })
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

router.post('/signin',(req,res)=>{
    const { email,password } = req.body
    if(!email || !password){
        return res.status(422).json({error:"please enter all fields"})
    }
    admin.findOne({email:email})
    .then(saveduser => {
        if(!saveduser){
            return res.status(422).json({error:"Invalid Email or Password"})
        }
        bcrypt.compare(password,saveduser.password)
        .then(doMatch =>{
            if(doMatch){
                const token = jwt.sign({_id:saveduser._id},JWT_SECRET)
                saveduser.password = undefined
                res.json({message:"logged in successfully..",token,user:saveduser})
            }
            else{
                return res.status(422).json({error:"Invalid Email or Password"})
            }
        })
        .catch(err=>console.log(err))
    }).catch(err=>console.log(err))
})

router.put('/createUser',adminauth,(req,res)=>{
    const { username, password, email, usertype } = req.body
    if(req.user.username !== 'admin'){
        return res.json({message:'You Should be an admin'})
    }
    admin.findOne({email:email})
    .then(oneofuser=>{
        if(oneofuser){
            if(oneofuser.usertype === usertype){
                return res.json({message:'User Already Exist'})
            }
        }
        bcrypt.hash(password,12)
        .then(hashpass => {
            const adminU = new admin({
                username,password:hashpass,email,usertype
            })
            adminU.save()
            .then(savedAdmin => {
                res.json({message:"User saved Successfully..."})
            })
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    })
})

router.get('/users',adminauth,(req,res)=>{
    if(req.user.username !== 'admin'){
        return res.json({message:'You Should be an admin'})
    }
    admin.find()
    .select('-password')
    .then(erre=>{
        res.json(erre)
    })
    .catch(err=>res.status(422).json(err))
})

module.exports = router