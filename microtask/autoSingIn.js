const express      = require('express')
const Joi          = require('joi')
const mongoose     = require('mongoose')
const bcrypt       = require('bcrypt')
const config       = require('config')
const jwt          = require("jsonwebtoken")

const router = express.Router()

router.get("/" , (req , res) => {
    const result = req.headers['x-test']
    if(!req.headers.hasOwnProperty('x-test')) return res.status(401).send("user need to login or sing up")
    try{
    const decoded = jwt.verify(result , config.get("secretkey"))

    return res.json({massage : "token is valid" , decoded})
    }catch(err){if(err) res.status(400).send("bad token")}
})

module.exports = router 
