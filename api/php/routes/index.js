
const authenticationController = require("../controllers/auth/authentication.controller")
const songRoutes = require("./song")
const userRoutes = require("./user")
const express = require("express");
const router = express.Router();


//router.use("/songs", songRoutes);
router.use("/songs", songRoutes);
router.use("/users",  userRoutes);

module.exports =  router 