const express      = require('express')
const Joi          = require('joi')
const mongoose     = require('mongoose')
const bcrypt       = require('bcrypt')
const config       = require('config')
const jwt          = require("jsonwebtoken")

const router = express.Router()

let Account = mongoose.model("acconts" , mongoose.Schema({
    name : {
        type : String,
        minlength : 3,
        maxlength : 50
    },
    email : {
        type : String,
        minlength : 5,
        maxlength : 100,
        unique : true
    },
    password : {
        type : String,
        minlength : 10,
        maxlength : 1024,
    }
}))

async function hashpass(pass){
    const salt = await bcrypt.genSalt(Number(config.get("bcrypt")))
    return bcrypt.hash(pass , salt)
}

function token(user){
    const token = jwt.sign({name : user.name , email : user.email} , config.get("secretkey"))
    return token
}

    const joiSchema = Joi.object({
        name : Joi.string().min(3).max(50).required(),
        email : Joi.string().email().required(),
        password : Joi.string().min(5).max(50).required()
    })

router.post('/' , async (req , res) => {
    const {error} = joiSchema.validate(req.body)
    if(error)return res.status(400).send(error.details[0].message)

    const existEmail = await Account.findOne({email : req.body.email})
    if(existEmail) return res.status(400).send(`email all ready registerd`)

    req.body.hash = await hashpass(req.body.password)

        let person = new Account({
            name : req.body.name,
            email : req.body.email,
            password : req.body.hash
        })

        await person.save()
        res.set("x-test" , token(person))
        res.send(person)
})


module.exports.Account = Account

module.exports.router = router