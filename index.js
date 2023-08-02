"use strict";

// Dependencies
const randomString = require("randomstring")
const bcryptJS = require("bcryptjs")
const express = require("express")
const hashJS = require("hash.js")
const moment = require("moment")
var gun = require("gun")

// Variables
const settings = require("./settings.json")
const krypton = {
    peers: settings.peers,
    adminKey: settings.adminKey
}

const web = express()
const port = process.env.PORT || 8080
const salt = bcryptJS.genSaltSync(13)

gun = new gun({ peers: krypton.peers })

// Functions
const toSHA512 = (string)=>{return hashJS.sha512().update(string).digest("hex")}

/// Configurations
//* Express
web.use(express.json())

// Main
web.use((err, req, res, next)=>{
    if(err.message === "Bad request") return res.json({
        status: "failed",
        message: "Bad request."
    })

    next()
})

web.post("/generateCode", async(req, res)=>{
    const body = req.body

    if(body.adminKey !== krypton.adminKey) return res.json({
        status: "fail",
        message: "Invalid adminKey."
    })

    //* Generate random 10-25 characters code and hash to SHA512
    const code = randomString.generate(Math.floor(Math.random() * 10 + 15))
    await gun.get("krypton").get("codes").get(toSHA512(code)).put(true)

    res.json({
        status: "success",
        data: code
    })
})


web.post("/signup", async(req, res)=>{
    const body = req.body

    if(!body.username || !body.password) return res.json({
        status: "failed",
        message: "Missing username/password."
    })

    const code = await gun.get("krypton").get("codes").get(toSHA512(body.code))

    if(!code) return res.json({
        status: "failed",
        message: "Invalid code."
    })

    const username = toSHA512(body.username)
    const account = await gun.get("krypton555Accounts").get(username)

    if(account) return res.json({
        status: "failed",
        message: "Account already exists."
    })

    //* Create new account & Deletes the existing code
    await gun.get("krypton555Accounts").get(username).put({
        username: username,
        password: bcryptJS.hashSync(body.password, salt),
        createdDate: moment().format("MMMM Do YYYY, h:mm:ss a")
    }); await gun.get("krypton").get("codes").get(toSHA512(body.code)).put(null)

    res.json({
        status: "success",
        data: true
    })
})

web.post("/login", async(req, res)=>{
    const body = req.body

    //* To reduce some internal process
    if(!body.username || !body.password) return res.json({
        status: "failed",
        message: "Invalid username/password."
    })

    const account = await gun.get("krypton555Accounts").get(toSHA512(body.username))

    if(!account || !bcryptJS.compareSync(body.password, account.password)) return res.json({
        status: "failed",
        message: "Invalid username/password."
    })

    res.json({
        status: "success",
        data: account
    })
})

web.use("*", (req, res)=>res.destroy())
web.listen(port, ()=>console.log(`Server is running. Port: ${port}`))