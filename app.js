"use strict"

require("dotenv").config()
require("./api/php/db_config/db.connection");
const indexRouter = require("./api/php/routes")
const express = require("express");
const { Mongoose } = require("mongoose");
const app = express();
const cors = require("cors");

app.use(cors())

app.set('x-powered-by', false);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    console.log(`requesting url: ${req.url}`);
    // res.header(`Access-Control-Allow-Origin`, process.env.CLIENT_URL);
    // res.header('Access-Control-Allow-Headers', 'Origin, XRequested-With, Content-Type, Accept');
    // res.header(`Access-Control-Allow-Methods`, `*`)
    next();
})

app.use("/api", indexRouter)


app.use(function (req, res) {
    res.status(404).json({ "error": "no route is found !" })
})


const server = app.listen(process.env.PORT, function () {
    console.log(`Server started and listening to port ${server.address().port}`)
})

console.log("server is being started....")