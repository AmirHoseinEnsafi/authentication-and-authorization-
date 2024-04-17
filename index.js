const express  = require('express')
const Joi      = require('joi')
const mongoose = require('mongoose')
const bcrypt   = require('bcrypt')

const createAccount = require('./microtask/createAccount')
const autoSingIn = require("./microtask/autoSingIn")
const login = require("./microtask/login")

const app = express()

mongoose.connect('mongodb://localhost/authentication')
    .then(() => console.log("connected to the server"))
    .catch((err) => console.log(`error upear somthing crash ${err.massage}`))

app.use(express.json())
app.use('/createAccount' , createAccount.router)
app.use("/autosingin" , autoSingIn)
app.use("/login" , login)

const PORT = process.env.PORT || 3000;

app.listen(PORT , ()=>{
    console.log(`listening on port ${PORT}`)
})
