"use strict";

// Dependencies
const express = require("express")
const gun = require("gun")

// Variables
const web = express()
const port = process.env.PORT || 8162

// Main
web.use(gun.serve)
web.use(express.static(__dirname))
web.listen(port, ()=>console.log(`Server is running. Port: ${port}`))