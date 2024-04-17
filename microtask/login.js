const express      = require('express')
const Joi          = require('joi')
const mongoose     = require('mongoose')
const bcrypt       = require('bcrypt')
const config       = require('config')
const jwt          = require("jsonwebtoken")

const router = express.Router()

const {Account} = require("./createAccount")

function checkEmail(email){
    const regEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regEmail.test(email)
}

function creatToken(user){
    const token = jwt.sign({name : user.name , email : user.email} , config.get("secretkey"))
    return token
}

async function findUser(user , res){        
        let h;
        
    if(checkEmail(user.email)){
       h = await Account.findOne({email : user.email})
    }else{
       h = await Account.findOne({name : user.email})
    }

    if(!h) return res.status(400).send("bad request [email , name] or password is wrong")

    const passIsValid = await bcrypt.compare(user.password , h.password)
    if(!passIsValid){

        return res.status(400).send("bad request [email , name] or password is wrong")
    }
    return res.set('x-test' , creatToken(user)).send("you are ok")
 }

router.post("/" , (req , res) => {
    const autoLog = req.headers['x-test']
    if(autoLog){
        try{
            const decoded = jwt.verify(autoLog , config.get("secretkey"))
        
            return res.json({massage : "token is valid" , decoded})
            }
            catch(err){
                console.log("sign in please")
            }
    }else{
        findUser(req.body , res)
    }
})

module.exports = router;