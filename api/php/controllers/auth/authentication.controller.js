"use strict";


require("dotenv").config()
const { response } = require("express");
const jwt = require("jsonwebtoken");
const util = require("util");
const { ACCESSS_TOKEN_SECRET } = process.env
const jwtVefifyPromise =  util.promisify(jwt.verify, { context: jwt });


const authenticateToken = function (req, res, next) {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    const response = {
        status: 403,
        message: 'Unauthorized'
    }
    if (authHeader && token!=null) {
        jwtVefifyPromise(token, ACCESSS_TOKEN_SECRET)
            .then((userCredential) => {
                console.log(userCredential);
                next();
            })
            .catch((err) => {
                _invalidAuthorizationToken(res, response)
            })
    } else {
        _invalidAuthorizationToken(res, response)
    }
}

const _invalidAuthorizationToken = function (res, response) {
    res.status(response.status).json(response.message);
}


module.exports = {
    authenticateToken
}