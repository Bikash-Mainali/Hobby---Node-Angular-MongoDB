"use strict"

const authController = require("../controllers/auth/authentication.controller")
const userController = require("../controllers/user-controller")
const express = require("express");
const userRoutes = express.Router();

userRoutes.route("/")
    .get(authController.authenticateToken, userController.getAll)
    .post(userController.addOne)
userRoutes.route("/login")
    .post(userController.login)


module.exports = userRoutes;
